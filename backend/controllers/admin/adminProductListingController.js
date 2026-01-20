const pool = require('../../config/dbConfig');
const cloudinary = require('../../config/supabase'); 

/* =========================
   Helper: Upload files
========================= */
const uploadFile = (file, folder, type = 'image') =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, { folder, resource_type: type }, (err, result) =>
      err ? reject(err) : resolve(result.secure_url)
    );
  });

/* =========================
   1️⃣ Get all listings (admin)
   Logic: JOIN with Farmers & Users to get Owner details
========================= */
const getAllListings = async (req, res) => {
  try {
    const { status, category, sellerId, startDate, endDate, limit = 20, offset = 0 } = req.query;

    const conditions = [];
    const values = [];
    let counter = 1;

    // Use alias 'ml' to avoid ambiguity during JOIN
    if (status) { conditions.push(`ml.status = $${counter++}`); values.push(status.toUpperCase()); }
    if (category) { conditions.push(`ml.product_category = $${counter++}`); values.push(category); }
    if (sellerId) { conditions.push(`ml.seller_id = $${counter++}`); values.push(sellerId); }
    if (startDate) { conditions.push(`ml.created_at >= $${counter++}`); values.push(startDate); }
    if (endDate) { conditions.push(`ml.created_at <= $${counter++}`); values.push(endDate); }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT 
          ml.*, 
          u.full_name AS owner_name, 
          u.phone AS owner_phone,
          u.photo_url AS owner_photo,
          f.farm_name,
          f.farm_type
       FROM marketplace_listings ml
       -- JOIN to Farmers table to find the farm node
       JOIN farmers f ON ml.seller_id = f.user_internal_id
       -- JOIN to Users table to find the actual human owner
       JOIN users u ON f.user_internal_id = u.id
       ${whereClause}
       ORDER BY ml.created_at DESC
       LIMIT $${counter++} OFFSET $${counter}`,
      [...values, limit, offset]
    );

    res.status(200).json({ 
        success: true, 
        count: result.rowCount, 
        message: "Registry DROP Fetched Successfully", 
        listings: result.rows 
    });
  } catch (err) {
    console.error('getAllListings error:', err);
    res.status(500).json({ success: false, message: 'Server error during registry fetch' });
  }
};

/* =========================
   2️⃣ Get single listing (With Owner Info)
========================= */
const getListingById = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const result = await pool.query(
      `SELECT ml.*, u.full_name as owner_name, f.farm_name 
       FROM marketplace_listings ml
       JOIN farmers f ON ml.seller_id = f.user_internal_id
       JOIN users u ON f.user_internal_id = u.id
       WHERE ml.listing_id = $1`,
      [listing_id]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Node not found in registry' });
    res.json({ success: true, listing: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registry connection error' });
  }
};

/* =========================
   3️⃣ Create listing (admin)
========================= */
const adminCreateListing = async (req, res) => {
  try {
    const fields = req.body;
    if (!fields.seller_id || !fields.product_category || !fields.product_name) {
      return res.status(400).json({ message: 'Missing Authority required fields' });
    }

    const primary_image_url = req.files?.primary_image
      ? await uploadFile(req.files.primary_image[0], 'marketplace/images')
      : null;

    const gallery_urls = req.files?.gallery_images
      ? await Promise.all(req.files.gallery_images.map(f => uploadFile(f, 'marketplace/images')))
      : [];

    const result = await pool.query(
      `INSERT INTO marketplace_listings (
        seller_id, product_category, product_name, variety_or_breed,
        dynamic_attributes, quantity, unit, quality_grade, price_per_unit,
        negotiability, region, zone, seller_name, primary_image_url, gallery_urls, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
      ) RETURNING listing_id`,
      [
        fields.seller_id, fields.product_category, fields.product_name, fields.variety_or_breed, 
        fields.dynamic_attributes || {}, fields.quantity, fields.unit, fields.quality_grade, 
        fields.price_per_unit, fields.negotiability, fields.region, fields.zone, 
        fields.seller_name, primary_image_url, gallery_urls, fields.status || 'ACTIVE'
      ]
    );

    res.status(201).json({ success: true, message: 'Registry Node Created', listing_id: result.rows[0].listing_id });
  } catch (err) {
    res.status(500).json({ message: 'DROP: Failed to create listing node' });
  }
};

/* =========================
   4️⃣ Update listing (admin)
========================= */
const adminUpdateListing = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const fields = { ...req.body };

    if (typeof fields.dynamic_attributes === 'string') fields.dynamic_attributes = JSON.parse(fields.dynamic_attributes);

    if (req.files?.primary_image) fields.primary_image_url = await uploadFile(req.files.primary_image[0], 'marketplace/images');

    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ message: 'No fields provided for update' });

    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(listing_id);

    const result = await pool.query(
      `UPDATE marketplace_listings SET ${setClause}, updated_at = NOW() WHERE listing_id = $${values.length} RETURNING listing_id`,
      values
    );

    res.json({ success: true, message: 'Registry DROP: Node updated', listing_id: result.rows[0].listing_id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to commit DROP update' });
  }
};

/* =========================
   5️⃣ Admin Action: Change Status
========================= */
const adminArchiveListing = (req, res) => adminChangeStatus(req, res, 'ARCHIVED', 'DROP_LISTING');

async function adminChangeStatus(req, res, status, action) {
  try {
    const { listing_id } = req.params;
    const admin_id = req.user.user_id;

    const result = await pool.query(
      `UPDATE marketplace_listings SET status = $1, updated_at = NOW() WHERE listing_id = $2 RETURNING listing_id`,
      [status, listing_id]
    );

    if (!result.rowCount) return res.status(404).json({ message: 'Listing not found' });

    await pool.query(
      `INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id) VALUES ($1,$2,'LISTING',$3)`,
      [admin_id, action, listing_id]
    );

    res.json({ success: true, message: `Registry DROP: ${action} Successful`, listing_id });
  } catch (err) {
    res.status(500).json({ message: `Authority failed to execute DROP` });
  }
}

module.exports = {
  getAllListings,
  getListingById,
  adminCreateListing,
  adminUpdateListing,
  adminArchiveListing
};
