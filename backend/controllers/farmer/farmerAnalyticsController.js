const pool = require('../../config/dbConfig');

/**
 * Crop Performance Analytics
 * Shows yield, area planted, productivity per crop
 */
exports.getCropAnalytics = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const result = await pool.query(
      `SELECT crop_name,
              SUM(quantity) AS total_quantity,
              AVG(yield_per_hectare) AS avg_yield,
              SUM(area_planted) AS total_area
       FROM crops
       WHERE farmer_id=$1
       GROUP BY crop_name`,
      [farmer_id]
    );
    res.json({ success: true, analytics: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Livestock Performance Analytics
 * Health, productivity, weight gain trends
 */
exports.getLivestockAnalytics = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const result = await pool.query(
      `SELECT species,
              COUNT(*) AS total_count,
              AVG(weight) AS avg_weight,
              AVG(productivity) AS avg_productivity
       FROM animals
       WHERE farmer_id=$1
       GROUP BY species`,
      [farmer_id]
    );
    res.json({ success: true, analytics: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Sales Analytics
 * Shows total revenue, total quantity sold, and breakdown per product category
 */
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const result = await pool.query(
      `SELECT category,
              SUM(quantity) AS total_quantity,
              SUM(price*quantity) AS total_revenue,
              COUNT(*) AS total_transactions
       FROM listings
       WHERE farmer_id=$1 AND status='sold'
       GROUP BY category`,
      [farmer_id]
    );
    res.json({ success: true, analytics: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Market Pricing Analytics
 * Compare farmer’s prices vs average market price (benchmarking)
 */
exports.getMarketPriceAnalytics = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const result = await pool.query(
      `SELECT l.product_name,
              l.price AS my_price,
              m.avg_price AS market_avg_price,
              l.quantity
       FROM listings l
       JOIN market_prices m ON l.product_name = m.product_name
       WHERE l.farmer_id=$1`,
      [farmer_id]
    );
    res.json({ success: true, analytics: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Dashboard KPIs
 * Total crops, animals, lands, active listings
 */
exports.getDashboardKPIs = async (req, res) => {
  try {
    const { farmer_id } = req.user;

    const [crops, animals, lands, listings] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total_crops FROM crops WHERE farmer_id=$1', [farmer_id]),
      pool.query('SELECT COUNT(*) AS total_animals FROM animals WHERE farmer_id=$1', [farmer_id]),
      pool.query('SELECT COUNT(*) AS total_lands FROM lands WHERE farmer_id=$1', [farmer_id]),
      pool.query('SELECT COUNT(*) AS active_listings FROM listings WHERE farmer_id=$1 AND status=\'active\'', [farmer_id])
    ]);

    res.json({
      success: true,
      kpis: {
        total_crops: crops.rows[0].total_crops,
        total_animals: animals.rows[0].total_animals,
        total_lands: lands.rows[0].total_lands,
        active_listings: listings.rows[0].active_listings
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Seasonal & Trend Analytics
 * Shows yield trends, price trends per season/year
 */
exports.getSeasonalTrends = async (req, res) => {
  try {
    const { farmer_id, product_name } = req.query;
    const result = await pool.query(
      `SELECT season, SUM(quantity) AS total_quantity, AVG(price) AS avg_price
       FROM listings
       WHERE farmer_id=$1 AND product_name=$2 AND status='sold'
       GROUP BY season
       ORDER BY season ASC`,
      [farmer_id, product_name]
    );
    res.json({ success: true, trends: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
