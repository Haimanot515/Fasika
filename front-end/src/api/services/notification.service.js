// Notification Business Service
// Uses mock data as backend is not ready

export const notificationService = {
    getNotifications: async (role) => {
        return [
            { id: 1, message: "System update scheduled for midnight.", role: "all", read: false },
            { id: 2, message: `Welcome to the ${role} portal!`, role: role, read: true },
            { id: 3, message: "New market advisory available.", role: "buyer", read: false },
        ].filter(n => n.role === "all" || n.role === role);
    },

    markAsRead: async (id) => {
        console.log(`Notification ${id} marked as read`);
        return { success: true };
    }
};
