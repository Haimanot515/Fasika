const fs = require('fs');
const pool = require('../config/dbConfig'); // use your existing DB config

async function insertEthiopiaJSON() {
    try {
        // Read JSON from the data folder
        const locations = fs.readFileSync('./data/ethiopia.json', 'utf-8');

        // Insert into region_zone_woreda table
        const query = 'INSERT INTO region_zone_woreda (data) VALUES ($1)';
        await pool.query(query, [locations]);

        console.log('✅ Ethiopia JSON inserted successfully!');
    } catch (error) {
        console.error('❌ Error inserting JSON:', error);
    } finally {
        pool.end(); // close DB connection
    }
}

// Run the script
insertEthiopiaJSON();
