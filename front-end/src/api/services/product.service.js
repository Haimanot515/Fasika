// Product Business Service
// Uses mock data as backend is not ready

export const productService = {
    getProducts: async () => {
        return [
            { id: 1, name: "Premium Teff", price: 2500, status: "Active", stock: 50 },
            { id: 2, name: "Organic Honey", price: 800, status: "Pending Approval", stock: 20 },
            { id: 3, name: "Coffee Beans", price: 1200, status: "Active", stock: 100 },
        ];
    },

    createProduct: async (data) => {
        console.log("Creating product:", data);
        return { success: true, message: "Product created successfully" };
    },

    updateProduct: async (id, data) => {
        console.log(`Updating product ${id}:`, data);
        return { success: true, message: "Product updated successfully" };
    },

    deleteProduct: async (id) => {
        console.log(`Deleting product ${id}`);
        return { success: true, message: "Product deleted successfully" };
    }
};
