// src/Pages/Pay.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  List,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllProducts } from "../Data/products"; // 修改导入

const { Title, Text } = Typography;

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "张三",
      phone: "13800138000",
      address: "北京市海淀区中关村大街1号北京大学宿舍楼A栋101室",
      distance: 30,
    },
    {
      id: 2,
      name: "李四",
      phone: "13900139000",
      address: "北京市朝阳区望京SOHO T1楼2001室",
      distance: 60,
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const allProducts = getAllProducts(); // 使用新函数获取所有商品
    const foundProduct = allProducts.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const handleDeleteAddress = (addressId) => {
    if (addresses.length <= 1) {
      message.warning("至少需要保留一个地址");
      return;
    }

    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个地址吗？",
      onOk() {
        const updatedAddresses = addresses.filter(
          (addr) => addr.id !== addressId
        );
        setAddresses(updatedAddresses);

        if (selectedAddressId === addressId) {
          setSelectedAddressId(updatedAddresses[0].id);
        }
      },
    });
  };

  // 提取数值价格的辅助函数
  const extractPriceNumber = (priceString) => {
    if (!priceString) return 0;
    // 从 "¥35.00" 中提取 35.00
    const match = priceString.match(/¥(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };
  const calculateShippingFee = () => {
    const selectedAddress = addresses.find(
      (addr) => addr.id === selectedAddressId
    );
    if (selectedAddress && selectedAddress.distance > 50) {
      return (selectedAddress.distance - 50) * 0.05;
    }
    return 0;
  };

  const shippingFee = calculateShippingFee();
  const productPrice = product ? extractPriceNumber(product.price) : 0;
  const totalPrice = productPrice + shippingFee;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    const newAddress = {
      id:
        addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1,
      ...values,
      distance: parseFloat(values.distance),
    };

    setAddresses([...addresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    setIsModalVisible(false);
    form.resetFields();
    message.success("地址添加成功");
  };

  const handleConfirmPurchase = () => {
    const selectedAddress = addresses.find(
      (addr) => addr.id === selectedAddressId
    );
    if (!selectedAddress) {
      message.warning("请选择收货地址");
      return;
    }

    Modal.success({
      title: "订单确认",
      content: (
        <div>
          <p>收货人: {selectedAddress.name}</p>
          <p>联系电话: {selectedAddress.phone}</p>
          <p>收货地址: {selectedAddress.address}</p>
        </div>
      ),
      onOk() {
        message.success("订单已确认，正在跳转...");
        // 这里可以跳转到支付完成页面
      },
    });
  };

  if (!product) {
    return <div>商品未找到</div>;
  }

  return (
    <div>
      <Navbar />

      <div className="container">
        <Title level={2} className="page-title">
          确认订单
        </Title>

        <Row gutter={[24, 24]}>
          {/* 收货地址区域 */}
          <Col span={24}>
            <Card
              title="收货地址"
              extra={
                <Button type="primary" onClick={showModal}>
                  管理地址
                </Button>
              }
              className="address-section"
            >
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={addresses}
                renderItem={(address) => (
                  <List.Item>
                    <Card
                      className={`address-item ${
                        address.id === selectedAddressId ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="address-content">
                        <div className="address-name">{address.name}</div>
                        <div className="address-phone">{address.phone}</div>
                        <div className="address-detail">{address.address}</div>
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 订单信息区域 */}
          <Col span={24}>
            <Card title="订单信息" className="order-section">
              <List
                itemLayout="horizontal"
                dataSource={[product]}
                renderItem={(item) => (
                  // 在订单信息区域修改图片显示
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          src={
                            item.image ||
                            "https://via.placeholder.com/80x80?text=无图"
                          } // 新增：默认 src
                          alt={item.name}
                          width={80}
                          height={80}
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=无图";
                          }}
                          loading="lazy" // 新增：懒加载
                        />
                      }
                      title={item.name}
                      description={<Text type="danger">{item.price}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 价格明细区域 */}
          <Col span={24}>
            <Card title="价格明细" className="price-section">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div className="price-row">
                  <span className="price-label">商品总价</span>
                  <span className="price-value">{product.price}</span>
                </div>
                <div className="price-row">
                  <span className="price-label">运费</span>
                  <span
                    className={`price-value shipping-fee ${
                      shippingFee === 0 ? "free" : ""
                    }`}
                  >
                    {shippingFee === 0 ? "¥0.00 (包邮)" : `¥${shippingFee}`}
                  </span>
                </div>
                <div className="price-row total-price">
                  <span className="price-label">合计</span>
                  <span className="price-value">¥{totalPrice}</span>
                </div>

                <div className="confirm-purchase">
                  <div></div>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleConfirmPurchase}
                  >
                    确认购买
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 地址管理弹窗 */}
      <Modal
        title="新增收货地址"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="收货人姓名"
            rules={[{ required: true, message: "请输入收货人姓名!" }]}
          >
            <Input placeholder="请输入收货人姓名" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: "请输入联系电话!" }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="address"
            label="详细地址"
            rules={[{ required: true, message: "请输入详细地址!" }]}
          >
            <Input.TextArea placeholder="请输入详细地址" rows={3} />
          </Form.Item>

          <Form.Item
            name="distance"
            label="距离(km)"
            rules={[{ required: true, message: "请输入距离!" }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              placeholder="请输入距离"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存地址
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
};

export default Pay;
