import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

})
// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    const access_token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (access_token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const pathname = window.location.pathname;
    const responseUrl = error.response?.config?.url;
    // Nếu lỗi là 401 và chưa từng retry
    if (error.response && error.response.status === 401 && !originalRequest._retry &&
      pathname !== '/login' &&
      responseUrl !== "/auth/refresh-token" &&
      responseUrl !== "/auth/logout") {
      originalRequest._retry = true;
      try {
  
        const res = await api.post('/auth/refresh-token', {
          refresh_token: localStorage.getItem('refresh_token'),
        }, { withCredentials: true });
        const { access_token, refresh_token } = res.data as { access_token?: string; refresh_token?: string };

        if (access_token) {
          localStorage.setItem('access_token', access_token);
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        }

        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh thất bại, xóa token và chuyển về trang login
        localStorage.removeItem('access_token');
        if (window.location.pathname !== '/login') window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default api