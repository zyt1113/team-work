// src/Pages/Homepage.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Carousel, Card, Typography } from "antd";
import { ReloadOutlined, UpOutlined } from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ProductCard from "../Components/ProductCard";
import { getProducts } from "../api/api";

const { Title } = Typography;

const Homepage = () => {
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getProducts();
        if (mounted) setDisplayedProducts(list);
      } catch {
        // getProducts 内已做降级，通常不会到这里
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleRefresh = () => {
    const allProducts = getAllProducts();
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    setDisplayedProducts(shuffled.slice(0, 10));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />

      {/* 轮播图区域 */}
      <div className="carousel-container">
        <Carousel autoplay>
          <div className="carousel-slide">
            <h2>校园二手交易平台</h2>
            <p>让闲置物品发挥更大价值</p>
          </div>
          <div className="carousel-slide">
            <h2>品质保障</h2>
            <p>严格的审核机制，确保交易安全</p>
          </div>
          <div className="carousel-slide">
            <h2>便捷交易</h2>
            <p>一站式服务，轻松买卖</p>
          </div>
        </Carousel>
      </div>

      {/* 悬浮侧边栏 */}
      <div className="sidebar">
        <div className="sidebar-item">APP</div>
        <div className="sidebar-item">收藏</div>
        <div className="sidebar-item">公众号</div>
        <div className="sidebar-item">微博</div>
        <div className="sidebar-item">帮助</div>
        <div className="sidebar-item">反馈</div>
        <Button
          type="primary"
          shape="circle"
          icon={<UpOutlined />}
          onClick={scrollToTop}
          className="top-btn"
        />
      </div>

      {/* 商品展示区域 */}
      <div className="products-section">
        <div className="section-header">
          <Title level={2} className="section-title">
            猜你喜欢
          </Title>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新推荐
          </Button>
        </div>
        <div className="products-grid">
          <Row gutter={[24, 24]}>
            {displayedProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
