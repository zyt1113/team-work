// src/Components/ProductCard.jsx
import React from "react";
import { Card, Image } from "antd";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // 图片加载错误处理（优化：添加默认 src 检查）
  const handleImageError = (e) => {
    e.target.src =
      product.image && product.image.startsWith("http")
        ? "https://via.placeholder.com/300x150?text=图片加载失败"
        : "https://via.placeholder.com/300x150?text=无图片";
  };

  return (
    <Card
      hoverable
      className="product-card"
      onClick={handleClick}
      cover={
        <div className="product-image">
          <img
            src={
              product.image || "https://via.placeholder.com/300x150?text=无图片"
            } // 新增：默认 src
            alt={product.name}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
            }}
            onError={handleImageError}
            loading="lazy" // 新增：懒加载优化性能
          />
        </div>
      }
    ></Card>
  );
};

export default ProductCard;
