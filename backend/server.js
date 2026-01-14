const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const pool = require('./config/dbConfig');

const app = express();

// 1️⃣ IMPORT ROUTES
const authRoutes = require('./routes/authentication/authRoutes'); 
const adminUserRoutes = require('./routes/admin/adminUserRoutes');
const adminFarmerRoutes = require('./routes/adminFarmerRoutes'); 
const farmerFarmRoutes = require('./routes/farmer/farmerFarmRoutes'); 
const farmerListingRoutes = require('./routes/farmer/farmerListingRoutes');

// 2️⃣ GLOBAL MIDDLEWARE
app.use(express.json()); 
app.use(cookieParser()); 

// 🛰️ REQUEST LOGGER
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

// 3️⃣ CORS CONFIGURATION (Updated for Production)
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://fasika-frontend.onrender.com', // 🚀 Explicit Production URL
    process.env.CLIENT_URL   
].filter(Boolean);

app.use(cors({ 
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or internal server calls)
        if (!origin) return callback(null, true); 
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`❌ CORS Blocked for origin: ${origin}`);
            callback(new Error('CORS Policy: Origin not allowed.'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4️⃣ DATABASE CONNECTION
pool.connect((err, client, release) => {
    if (err) return console.error('❌ Database connection failed:', err.stack);
    console.log('✅ Database connected successfully');
    release();
});

// 5️⃣ MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/farmers', adminFarmerRoutes);
app.use('/api/farmer/farm', farmerFarmRoutes);
app.use('/api/farmer/listings', farmerListingRoutes);

// 6️⃣ CATCH-ALL 404 HANDLER
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: "Route Not Found",
        message: `The path ${req.originalUrl} does not exist on this DROP registry.` 
    });
});

// 7️⃣ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({ 
        success: false, 
        error: "Internal Server Error", 
        message: err.message 
    });
});

// 8️⃣ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Registry Base: http://localhost:${PORT}/api`);
    console.log(`🚜 Land Endpoint: http://localhost:${PORT}/api/farmer/farm/land`);
    console.log(`🌽 Listings Endpoint: http://localhost:${PORT}/api/farmer/listings`);
});
