import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})
// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
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
    // Check if response is HTML instead of JSON
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE')) {
      console.error('Received HTML response instead of JSON:', response.data.substring(0, 200));
      throw new Error('Server returned HTML instead of JSON. Check API endpoint.');
    }
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log('Axios error interceptor:', error.response?.status, error.response?.data);
    
    // Check if error response is HTML
    if (error.response && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
      console.error('Received HTML error response:', error.response.data.substring(0, 200));
      throw new Error(`API Error ${error.response.status}: Server returned HTML instead of JSON`);
    }
    
    // Nếu lỗi là 401 và chưa từng retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh token (giả sử backend trả về { token: '...' })
        const res = await api.post('/auth/refresh', {}, { withCredentials: true });
        const data = res.data as { token?: string };
        const newToken = data.token;
        if (newToken) {
          localStorage.setItem('token', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
           return api(originalRequest);
          }
      } catch (refreshError) {
        // Nếu refresh thất bại, xóa token và chuyển về trang login  
        localStorage.removeItem('token');
        // TEMPORARY: Không redirect về login cho product pages
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/product/')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default api