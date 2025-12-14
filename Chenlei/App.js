import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import Login from "./Pages/Login";
import Homepage from "./Pages/Homepage";
import ProductDetails from "./Pages/ProductDetails";
import Pay from "./Pages/Pay";
import CartPage from "./Pages/CartPage";
import OrdersPage from "./Pages/OrderPage";
import UserPage from "./Pages/UserPage";
import "./App.css";

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/pay/:id" element={<Pay />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
