const API_URL = "https://your-api.com/api/users";

export const userService = {
  getProfile: async (token) => {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  }
};