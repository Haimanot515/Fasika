const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // existing DB config

// ---------------------------
// 1️⃣ Get all regions
router.get('/regions', async (req, res) => {
    try {
        const result = await pool.query('SELECT data FROM region_zone_woreda LIMIT 1');
        const data = result.rows[0].data;
        const regions = data.regions.map(r => r.name);
        res.json(regions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch regions' });
    }
});

// ---------------------------
// 2️⃣ Get zones for a selected region
router.get('/zones/:region', async (req, res) => {
    const { region } = req.params;
    try {
        const result = await pool.query('SELECT data FROM region_zone_woreda LIMIT 1');
        const data = result.rows[0].data;

        const regionObj = data.regions.find(r => r.name === region);
        if (!regionObj) return res.status(404).json({ error: 'Region not found' });

        const zones = regionObj.zones.map(z => z.name);
        res.json(zones);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch zones' });
    }
});

// ---------------------------
// 3️⃣ Get woredas for a selected region and zone
router.get('/woredas/:region/:zone', async (req, res) => {
    const { region, zone } = req.params;
    try {
        const result = await pool.query('SELECT data FROM region_zone_woreda LIMIT 1');
        const data = result.rows[0].data;

        const regionObj = data.regions.find(r => r.name === region);
        if (!regionObj) return res.status(404).json({ error: 'Region not found' });

        const zoneObj = regionObj.zones.find(z => z.name === zone);
        if (!zoneObj) return res.status(404).json({ error: 'Zone not found' });

        res.json(zoneObj.woredas);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch woredas' });
    }
});

module.exports = router;
