// ...existing code...
import request from "./request";
import { getAllProducts as getLocalProducts } from "../Data/products";

/*
  说明：
  - 后端基础路径 https://localhost:3000/api 已在 request.js 中设置
  - 出现网络或后端错误时，和商品相关的接口会回退到本地 Data/products.js 提供的数据
*/

// 商品相关
export const getProducts = async () => {
  try {
    // 假设后端 /products 返回数组
    const data = await request.get("/products");
    return Array.isArray(data) ? data : data.items || [];
  } catch (err) {
    // 降级到本地
    return getLocalProducts();
  }
};

export const getProductById = async (id) => {
  try {
    const data = await request.get(`/products/${id}`);
    return data;
  } catch (err) {
    // 降级：在本地数据中查找
    const local = getLocalProducts();
    return local.find((p) => p.id === parseInt(id)) || null;
  }
};

// 用户/认证
export const login = async (identifier, password) => {
  return request.post("/auth/login", { identifier, password });
};

export const register = async (userInfo) => {
  return request.post("/auth/register", userInfo);
};

export const getUserProfile = async () => {
  return request.get("/user/profile");
};

export const updateUserProfile = async (payload) => {
  return request.put("/user/profile", payload);
};

// 购物车
export const getCart = async () => {
  try {
    return await request.get("/cart");
  } catch (err) {
    // 降级到 localStorage
    const saved = localStorage.getItem("shopping_cart");
    return saved ? JSON.parse(saved) : [];
  }
};

export const addToCart = async (item) => {
  try {
    return await request.post("/cart/add", item);
  } catch (err) {
    // 本地处理：保存到 localStorage
    const saved = JSON.parse(localStorage.getItem("shopping_cart") || "[]");
    saved.push(item);
    localStorage.setItem("shopping_cart", JSON.stringify(saved));
    return { ok: true, local: true };
  }
};

export const updateCartItem = async (itemId, payload) => {
  return request.put(`/cart/${itemId}`, payload);
};

export const removeCartItem = async (itemId) => {
  try {
    return await request.delete(`/cart/${itemId}`);
  } catch (err) {
    // 本地删除降级
    const saved = JSON.parse(localStorage.getItem("shopping_cart") || "[]");
    const filtered = saved.filter((i) => i.id !== itemId);
    localStorage.setItem("shopping_cart", JSON.stringify(filtered));
    return { ok: true, local: true };
  }
};

// 订单
export const createOrder = async (orderPayload) => {
  return request.post("/orders", orderPayload);
};

export const getOrders = async () => {
  return request.get("/orders");
};

// 图片上传（若后端支持）
export const uploadImage = async (formData) => {
  return request.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
// ...existing code...
