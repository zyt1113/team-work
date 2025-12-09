import React from "react";
import { Card, Image } from "antd";
import { useNavigate } from "react-router-dom";

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
          <Image
            src={product.image}
            alt={product.name}
            preview={false}
            fallback="https://via.placeholder.com/300x150?text=No+Image"
          />
        </div>
      }
    >
      <Card.Meta
        title={product.name}
        description={
          <div className="product-info">
            <div className="product-price">{product.price}</div>
            <div className="product-meta">
              <span>{product.school}</span>
              <span>{product.time}</span>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
