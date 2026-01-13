const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * 1️⃣ Create a new offer
 */
const createOffer = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const {
      productId,
      offerTitle,
      description,
      pricePerUnit,
      quantityAvailable,
      startDate,
      endDate
    } = req.body;

    const offerId = uuidv4();

    await pool.query(
      `
      INSERT INTO farmer_offers
      (offer_id, farmer_id, product_id, offer_title, description, price_per_unit, quantity_available, start_date, end_date, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
      `,
      [
        offerId,
        farmerId,
        productId,
        offerTitle,
        description,
        pricePerUnit,
        quantityAvailable,
        startDate,
        endDate
      ]
    );

    return res.status(201).json({ success: true, message: 'Offer created', offerId });
  } catch (err) {
    console.error('createOffer error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * 2️⃣ Get all offers for a farmer
 */
const getFarmerOffers = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const { rows } = await pool.query(
      `
      SELECT * FROM farmer_offers
      WHERE farmer_id=$1
      ORDER BY created_at DESC
      `,
      [farmerId]
    );

    return res.json({ success: true, offers: rows });
  } catch (err) {
    console.error('getFarmerOffers error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * 3️⃣ Get single offer by ID
 */
const getOfferById = async (req, res) => {
  try {
    const { offerId } = req.params;
    const farmerId = req.user.id;

    const { rows } = await pool.query(
      `
      SELECT * FROM farmer_offers
      WHERE offer_id=$1 AND farmer_id=$2
      `,
      [offerId, farmerId]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: 'Offer not found' });

    return res.json({ success: true, offer: rows[0] });
  } catch (err) {
    console.error('getOfferById error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * 4️⃣ Update an existing offer
 */
const updateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const farmerId = req.user.id;
    const {
      offerTitle,
      description,
      pricePerUnit,
      quantityAvailable,
      startDate,
      endDate
    } = req.body;

    const result = await pool.query(
      `
      UPDATE farmer_offers
      SET offer_title=$1, description=$2, price_per_unit=$3, quantity_available=$4, start_date=$5, end_date=$6, updated_at=NOW()
      WHERE offer_id=$7 AND farmer_id=$8
      RETURNING *
      `,
      [offerTitle, description, pricePerUnit, quantityAvailable, startDate, endDate, offerId, farmerId]
    );

    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Offer not found' });

    return res.json({ success: true, message: 'Offer updated', offer: result.rows[0] });
  } catch (err) {
    console.error('updateOffer error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * 5️⃣ Delete an offer
 */
const deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const farmerId = req.user.id;

    const result = await pool.query(
      `DELETE FROM farmer_offers WHERE offer_id=$1 AND farmer_id=$2 RETURNING *`,
      [offerId, farmerId]
    );

    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Offer not found' });

    return res.json({ success: true, message: 'Offer deleted' });
  } catch (err) {
    console.error('deleteOffer error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  createOffer,
  getFarmerOffers,
  getOfferById,
  updateOffer,
  deleteOffer
};
