import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // 如需携带 cookie 可打开
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("current_user");
    }
    return Promise.reject(
      error.response ? error.response.data || error.response : error
    );
  }
);
// 添加获取所有产品的函数
export const getAllProducts = () => {
  return apiClient.get("/products");
};

// 添加其他常用的产品相关方法
export const getProductById = (id) => {
  return apiClient.get(`/products/${id}`);
};

export default apiClient;
