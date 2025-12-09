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
  message,
} from "antd";
import {
  MessageOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { products } from "../Data/products";

const { Title, Text } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);

    // 检查商品是否已在购物车中
    const savedCart = localStorage.getItem("shopping_cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const exists = cartItems.some((item) => item.productId === parseInt(id));
      setIsInCart(exists);
    }
  }, [id]);

  const handleBuyNow = () => {
    navigate(`/pay/${id}`);
  };

  // 加入购物车功能
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: Date.now(), // 唯一ID
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller.name,
      quantity: 1,
    };

    // 从本地存储获取现有购物车数据
    const savedCart = localStorage.getItem("shopping_cart");
    let cartItems = [];

    if (savedCart) {
      cartItems = JSON.parse(savedCart);
    }

    // 检查商品是否已存在
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // 如果已存在，增加数量
      cartItems[existingItemIndex].quantity += 1;
      message.info("商品数量已增加");
    } else {
      // 如果不存在，添加新商品
      cartItems.push(cartItem);
      message.success("商品已加入购物车");
    }

    // 保存到本地存储
    localStorage.setItem("shopping_cart", JSON.stringify(cartItems));
    setIsInCart(true);
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
                  type="default"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <>
                      <CheckOutlined /> 已在购物车
                    </>
                  ) : (
                    "加入购物车"
                  )}
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
