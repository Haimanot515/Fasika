// Dashboard Business Service
// Uses mock data as backend is not ready

export const dashboardService = {
    getAdminStats: async () => {
        return {
            totalUsers: 156,
            activeFarmers: 89,
            totalProducts: 432,
            pendingApprovals: 12,
            recentActivity: [
                { id: 1, action: "New Farmer Registered", user: "Abebe B.", time: "2 hours ago" },
                { id: 2, action: "Product Approved", user: "Admin", item: "Honey", time: "5 hours ago" },
            ]
        };
    },

    getFarmerStats: async () => {
        return {
            productCount: 8,
            activeListings: 5,
            pendingReviews: 3,
            weatherAlert: "Heavy rain expected in Oromia region next Tuesday.",
            recentNotifications: [
                { id: 1, text: "Your product 'Coffee' has been approved.", read: false },
                { id: 2, text: "Check new weather forecast.", read: true },
            ]
        };
    },

    getBuyerStats: async () => {
        return {
            featuredProducts: [
                { id: 1, name: "Honey", price: 800, image: "/honey.jpg" },
                { id: 2, name: "Teff", price: 2500, image: "/teff.jpg" },
            ],
            marketTrends: "Grain prices are currently stable.",
        };
    }
};
