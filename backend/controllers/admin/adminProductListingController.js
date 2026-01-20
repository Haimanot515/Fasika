const pool = require('../../config/dbConfig');
const cloudinary = require('../../config/supabase'); // Note: Ensure your config name matches (Cloudinary vs Supabase)

/* =========================
   Helper: Upload files to Cloudinary
========================= */
const uploadFile = (file, folder, type = 'image') =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, { folder, resource_type: type }, (err, result) =>
      err ? reject(err) : resolve(result.secure_url)
    );
  });

/* =========================
   1️⃣ Get all listings (admin)
========================= */
const getAllListings = async (req, res) => {
  try {
    const { status, category, sellerId, startDate, endDate, limit = 20, offset = 0 } = req.query;

    const conditions = [];
    const values = [];
    let counter = 1;

    if (status) { conditions.push(`status = $${counter++}`); values.push(status.toUpperCase()); }
    if (category) { conditions.push(`product_category = $${counter++}`); values.push(category); }
    if (sellerId) { conditions.push(`seller_id = $${counter++}`); values.push(sellerId); }
    if (startDate) { conditions.push(`created_at >= $${counter++}`); values.push(startDate); }
    if (endDate) { conditions.push(`created_at <= $${counter++}`); values.push(endDate); }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Fixed the indexing for limit and offset
    const result = await pool.query(
      `SELECT * FROM marketplace_listings
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${counter++} OFFSET $${counter}`,
      [...values, limit, offset]
    );

    res.status(200).json({ success: true, count: result.rowCount, listings: result.rows });
  } catch (err) {
    console.error('getAllListings error:', err);
    res.status(500).json({ success: false, message: 'Server error during registry fetch' });
  }
};

/* =========================
   2️⃣ Get single listing
========================= */
const getListingById = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM marketplace_listings WHERE listing_id = $1`,
      [listing_id]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Node not found in registry' });
    res.json({ success: true, listing: result.rows[0] });
  } catch (err) {
    console.error('getListingById error:', err);
    res.status(500).json({ success: false, message: 'Registry connection error' });
  }
};

/* =========================
   3️⃣ Create listing (admin)
========================= */
const adminCreateListing = async (req, res) => {
  try {
    const fields = req.body;
    
    // Core validation
    if (!fields.seller_id || !fields.product_category || !fields.product_name) {
      return res.status(400).json({ message: 'Missing Authority required fields' });
    }

    // Media Processing
    const primary_image_url = req.files?.primary_image
      ? await uploadFile(req.files.primary_image[0], 'marketplace/images')
      : null;

    const gallery_urls = req.files?.gallery_images
      ? await Promise.all(req.files.gallery_images.map(f => uploadFile(f, 'marketplace/images')))
      : [];

    const video_url = req.files?.video
      ? await uploadFile(req.files.video[0], 'marketplace/videos', 'video')
      : null;

    const document_urls = req.files?.document_files
      ? await Promise.all(req.files.document_files.map(f => uploadFile(f, 'marketplace/documents', 'raw')))
      : [];

    const result = await pool.query(
      `INSERT INTO marketplace_listings (
        seller_id, product_category, product_name, variety_or_breed,
        dynamic_attributes, quantity, unit, quality_grade, price_per_unit,
        negotiability, bulk_discount, region, zone, woreda, kebele,
        availability_start_ec, availability_end_ec, delivery_option, delivery_radius_km,
        transport_provided, storage_condition, packaging_type, seller_name, contact_phone,
        contact_email, cooperative_name, certifications, primary_image_url, gallery_urls,
        video_url, document_urls, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32
      ) RETURNING listing_id`,
      [
        fields.seller_id, fields.product_category, fields.product_name, fields.variety_or_breed, 
        fields.dynamic_attributes || {}, // Default to empty object if null
        fields.quantity, fields.unit, fields.quality_grade, fields.price_per_unit, fields.negotiability, 
        fields.bulk_discount, fields.region, fields.zone, fields.woreda, fields.kebele, 
        fields.availability_start_ec, fields.availability_end_ec, fields.delivery_option, 
        fields.delivery_radius_km, fields.transport_provided, fields.storage_condition,
        fields.packaging_type, fields.seller_name, fields.contact_phone, fields.contact_email, 
        fields.cooperative_name, fields.certifications, primary_image_url, gallery_urls, 
        video_url, document_urls, fields.status || 'ACTIVE'
      ]
    );

    res.status(201).json({ success: true, message: 'Registry Node Created', listing_id: result.rows[0].listing_id });
  } catch (err) {
    console.error('adminCreateListing error:', err);
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

    // Handle incoming JSON fields if sent as strings (via FormData)
    if (typeof fields.dynamic_attributes === 'string') fields.dynamic_attributes = JSON.parse(fields.dynamic_attributes);

    // Handle media updates
    if (req.files?.primary_image) fields.primary_image_url = await uploadFile(req.files.primary_image[0], 'marketplace/images');
    if (req.files?.gallery_images) fields.gallery_urls = await Promise.all(req.files.gallery_images.map(f => uploadFile(f, 'marketplace/images')));
    if (req.files?.video) fields.video_url = await uploadFile(req.files.video[0], 'marketplace/videos', 'video');
    if (req.files?.document_files) fields.document_urls = await Promise.all(req.files.document_files.map(f => uploadFile(f, 'marketplace/documents', 'raw')));

    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ message: 'No fields provided for update' });

    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(listing_id);

    const result = await pool.query(
      `UPDATE marketplace_listings
       SET ${setClause}, updated_at = NOW()
       WHERE listing_id = $${values.length}
       RETURNING listing_id`,
      values
    );

    if (!result.rowCount) return res.status(404).json({ message: 'Target node not found' });
    res.json({ success: true, message: 'Registry DROP: Node updated', listing_id: result.rows[0].listing_id });
  } catch (err) {
    console.error('adminUpdateListing error:', err);
    res.status(500).json({ message: 'Failed to commit DROP update' });
  }
};

/* =========================
   5️⃣ Admin Action: Change Status (PAUSE, ARCHIVE, etc.)
========================= */
const adminPauseListing = (req, res) => adminChangeStatus(req, res, 'PAUSED', 'PAUSE_LISTING');
const adminArchiveListing = (req, res) => adminChangeStatus(req, res, 'SUSPENDED', 'ARCHIVE_LISTING', true);
const adminUndoArchive = (req, res) => adminChangeStatus(req, res, 'ACTIVE', 'UNDO_ARCHIVE_LISTING', false);

async function adminChangeStatus(req, res, status, action, checkActiveOrders = false) {
  try {
    const { listing_id } = req.params;
    const admin_id = req.user.user_id;
    const reason = req.body.reason || null;

    if (checkActiveOrders) {
      const activeOrders = await pool.query(
        `SELECT 1 FROM marketplace_orders WHERE listing_id = $1 AND status IN ('NEW','PENDING','IN_TRANSIT')`,
        [listing_id]
      );
      if (activeOrders.rowCount > 0) return res.status(409).json({ message: 'Registry locked: Active orders detected' });
    }

    const result = await pool.query(
      `UPDATE marketplace_listings SET status = $1, updated_at = NOW() WHERE listing_id = $2 RETURNING listing_id`,
      [status, listing_id]
    );

    if (!result.rowCount) return res.status(404).json({ message: 'Listing not found' });

    // Log the DROP action in Audit Logs
    await pool.query(
      `INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, reason)
       VALUES ($1,$2,'LISTING',$3,$4)`,
      [admin_id, action, listing_id, reason]
    );

    res.json({ success: true, message: `Action ${action} completed`, listing_id });
  } catch (err) {
    console.error(`${action} error:`, err);
    res.status(500).json({ message: `Authority failed to ${action}` });
  }
}

module.exports = {
  getAllListings,
  getListingById,
  adminCreateListing,
  adminUpdateListing,
  adminPauseListing,
  adminArchiveListing,
  adminUndoArchive,
  boostListing: async (req, res) => { /* Logic here */ },
  markListingSold: async (req, res) => { /* Logic here */ }
};
