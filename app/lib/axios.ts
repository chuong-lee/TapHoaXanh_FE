import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

})
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  //them access token tại đây để truyền xuống backend.
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  //them xử lý refresh token tại đây nếu api trả về 401.
  //xử lý lại request sau khi có access mới.
    return response;
  }, function (error) {
    return Promise.reject(error);
  });
export default api