// src/Components/ProductCard.jsx
import React from "react";
import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
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
            }
            alt={product.name}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x150?text=图片加载失败";
            }}
            loading="lazy"
          />
        </div>
      }
    >
      {/* 添加这部分来显示商品名称 */}
      <Card.Meta
        title={
          <Text ellipsis style={{ maxWidth: "100%" }}>
            {product.name}
          </Text>
        }
        description={
          <div>
            <Text type="danger">{product.price}</Text>
            <br />
            <Text type="secondary">{product.school}</Text>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
