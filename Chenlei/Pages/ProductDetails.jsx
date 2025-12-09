import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Image,
  Button,
  Typography,
  Space,
  Rate,
  Avatar,
} from "antd";
import {
  MessageOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { products } from "../Data/products";

const { Title, Text } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const handleBuyNow = () => {
    navigate(`/pay/${id}`);
  };

  if (!product) {
    return <div>商品未找到</div>;
  }

  return (
    <div>
      <Navbar />

      <div className="container">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            {/* 卖家信息区域 */}
            <Card className="seller-info">
              <Space size="middle">
                <Avatar size={64}>{product.seller.avatar}</Avatar>
                <div className="seller-details">
                  <Title level={4} className="seller-name">
                    {product.seller.name}
                  </Title>
                  <div className="seller-rating">
                    <Rate disabled defaultValue={5} />
                    <Text type="warning">
                      {" "}
                      好评率: {product.seller.rating}%
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* 商品详情区域 */}
          <Col xs={24} md={12}>
            <Card className="product-images">
              <Image
                src={product.image}
                alt={product.name}
                className="main-image"
              />
              <Button
                type="default"
                icon={<ExclamationCircleOutlined />}
                className="report-button"
              >
                举报
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card className="product-info">
              <Title level={2} className="product-price">
                {product.price}
                <span className="free-shipping">包邮</span>
              </Title>

              <div className="product-description">{product.description}</div>

              <Space className="action-buttons">
                <Button
                  type="primary"
                  size="large"
                  icon={<MessageOutlined />}
                  className="chat-button"
                >
                  聊一聊
                </Button>
                <Button
                  type="danger"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="buy-button"
                  onClick={handleBuyNow}
                >
                  立即购买
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
