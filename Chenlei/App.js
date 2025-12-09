import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import Login from "./Pages/Login";
import Homepage from "./Pages/Homepage";
import ProductDetails from "./Pages/ProductDetails";
import Pay from "./Pages/Pay";
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
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
