import axios from "axios";

const api = axios.create({
  // Ensure your VITE_API_URL does NOT have a trailing slash
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // 🚨 CRITICAL: Sends and receives HttpOnly cookies
});

// Request Interceptor: No longer needs to manually attach headers if 
// you are strictly using cookies, but kept here for compatibility 
// with any header-based legacy routes.
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't tried refreshing yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        /* 1. Hit the refresh endpoint. 
           Because of withCredentials: true, the browser sends the 
           'refresh_token' cookie automatically.
        */
        await api.post("/auth/refresh");

        /* 2. If successful, the server has sent a new 'auth_token' cookie.
           We simply retry the original request. The browser will 
           automatically include the new cookie.
        */
        return api(originalRequest);
      } catch (err) {
        /* 3. If refresh fails (session truly expired or revoked), 
           clear local state and send to login.
        */
        console.error("Refresh session failed. Redirecting to login...");
        localStorage.clear(); // Clear any non-auth user preferences
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

