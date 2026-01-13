import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiOutlineTrendingUp } from 'react-icons/hi';

const AdminFarmerStatsDashboard = () => {
    const [stats, setStats] = useState({ 
        total_lands: 0, 
        total_animals: 0, 
        total_ads: 0, 
        total_soil_reports: 0 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- INTEGRATED API LOGIC ---
    // This replaces the need for adminFarmerService import
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token'); // Get your auth token
            const response = await axios.get('http://localhost:5000/api/admin/farmers/stats/summary', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error("Stats sync failed:", err);
            setError("Could not load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // --- STYLING ---
    const cardStyle = {
        background: '#fff',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        flex: '1',
        minWidth: '220px',
        border: '1px solid #f0f0f0'
    };

    if (loading) return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <div className="spinner">🌾</div>
            <p>Calculating Registry Totals...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
            {error}
        </div>
    );

    return (
        <div style={{ padding: '40px', background: '#f0f4f8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#1a202c', marginBottom: '10px', fontSize: '28px' }}>Fasikas Admin Overview</h1>
                <p style={{ color: '#718096' }}>Real-time system status for agricultural registries.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Land Card */}
                <div style={cardStyle}>
                    <div style={{ color: '#27ae60', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Total Land Plots
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#2d3748' }}>{stats.total_lands}</div>
                    <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '10px' }}>Registered farm acreage</div>
                </div>

                {/* Livestock Card */}
                <div style={cardStyle}>
                    <div style={{ color: '#2980b9', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Livestock Count
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#2d3748' }}>{stats.total_animals}</div>
                    <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '10px' }}>Active animal headcounts</div>
                </div>

                {/* Market Card */}
                <div style={cardStyle}>
                    <div style={{ color: '#f39c12', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Market Listings
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#2d3748' }}>{stats.total_ads}</div>
                    <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '10px' }}>Current public advertisements</div>
                </div>

                {/* Soil Card */}
                <div style={cardStyle}>
                    <div style={{ color: '#8e44ad', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Soil Analyses
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#2d3748' }}>{stats.total_soil_reports}</div>
                    <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '10px' }}>Lab reports generated</div>
                </div>
            </div>

            {/* Health Status Bar */}
            <div style={{ marginTop: '40px', background: '#fff', padding: '30px', borderRadius: '15px', borderLeft: '6px solid #27ae60' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 10px 0', color: '#2d3748' }}>
                    <HiOutlineTrendingUp color="#27ae60"/> Database Integrity
                </h3>
                <p style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    All registries are currently synchronized with the central database. 
                    The <strong>DROP</strong> schema protection is active: deleting a Land Plot 
                    will automatically cascade to associated Soil Reports and Crop data.
                </p>
            </div>
        </div>
    );
};

export default AdminFarmerStatsDashboard;