// CartPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Image,
  Button,
  Typography,
  List,
  message,
  Empty,
  Space,
  Checkbox,
} from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const { Title, Text } = Typography;
/*
 * API 接口说明:
 *
 * 1. 获取购物车商品接口
 *    URL: /api/cart
 *    方法: GET
 *    请求头: Authorization: Bearer <token>
 *    响应数据:
 *      - items: 购物车商品列表
 *        - id: 商品ID
 *        - name: 商品名称
 *        - price: 商品价格
 *        - image: 商品图片
 *        - seller: 卖家信息
 *        - quantity: 数量
 *
 * 2. 添加商品到购物车接口
 *    URL: /api/cart/add
 *    方法: POST
 *    请求头: Authorization: Bearer <token>
 *    请求参数:
 *      - productId: 商品ID
 *      - quantity: 数量
 *    响应数据:
 *      - message: 操作结果消息
 *
 * 3. 更新购物车商品数量接口
 *    URL: /api/cart/update
 *    方法: PUT
 *    请求头: Authorization: Bearer <token>
 *    请求参数:
 *      - itemId: 购物车项目ID
 *      - quantity: 新数量
 *    响应数据:
 *      - message: 操作结果消息
 *
 * 4. 从购物车删除商品接口
 *    URL: /api/cart/remove
 *    方法: DELETE
 *    请求头: Authorization: Bearer <token>
 *    请求参数:
 *      - itemId: 购物车项目ID
 *    响应数据:
 *      - message: 操作结果消息
 */

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  /*////！！！！！！！！！！！！！！！！！！！！！！！！！！！
//////！！！！！！！！！！！！！！！！！！！！！！！！！！！
//////！！！！！！！！！！！！！！！！！！！！！！！！！！！
负责接口的务必要记得，当前页面的接口是从本地存储加载购物车数据，用注释里的useEffect的话记得改一下，不会改就扔给ai，然后自己仔细仔细仔细校对！！！！！
//////！！！！！！！！！！！！！！！！！！！！！！！！！！！
//////！！！！！！！！！！！！！！！！！！！！！！！！！！！
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/cart', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setCartItems(data.items);
          // 默认选中所有商品
          setSelectedItems(data.items.map((item) => item.id));
        } else {
          message.error(data.message || '获取购物车数据失败');
        }
      } catch (error) {
        message.error('网络错误，请稍后重试！');
      }
    };
    
    fetchCartItems();
  }, []);
  */
  // 从本地存储加载购物车数据
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping_cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      // 默认选中所有商品
      setSelectedItems(parsedCart.map((item) => item.id));
    }
  }, []);

  // 保存购物车数据到本地存储
  const saveCartToLocalStorage = (items) => {
    localStorage.setItem("shopping_cart", JSON.stringify(items));
  };

  // 切换商品选择状态
  const toggleItemSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // 全选/取消全选
  // src/Pages/CartPage.jsx
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length && cartItems.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // 删除商品
  /*
  const removeItemAPI = async (itemId) => {
    try {
      const response = await fetch(`/api/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ itemId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        message.success(data.message || '商品已从购物车移除');
        // 更新本地状态
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
        saveCartToLocalStorage(updatedItems);
        
        // 同时更新选中状态
        setSelectedItems(selectedItems.filter((id) => id !== itemId));
      } else {
        message.error(data.message || '删除失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试！');
    }
  };
  */
  // 删除商品
  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);

    // 同时更新选中状态
    setSelectedItems(selectedItems.filter((id) => id !== itemId));
    message.success("商品已从购物车移除");
  };

  // 增加商品数量
  /*
  const updateQuantityAPI = async (itemId, newQuantity) => {
    try {
      const response = await fetch(`/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 更新本地状态
        const updatedItems = cartItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        setCartItems(updatedItems);
        saveCartToLocalStorage(updatedItems);
      } else {
        message.error(data.message || '更新数量失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试！');
    }
  };
  */
  // 增加商品数量
  const increaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
  };

  // 减少商品数量
  const decreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
  };

  // 计算选中商品总价
  const calculateTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const price = parseFloat(item.price.replace("¥", ""));
        return total + price * item.quantity;
      }, 0);
  };

  // 结算选中的商品
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.warning("请至少选择一件商品");
      return;
    }

    // 这里可以跳转到结算页面，或者直接跳转到支付页面（简化处理）
    message.success("即将跳转到结算页面");
    // 示例：跳转到第一个选中商品的支付页面
    const firstSelectedItem = cartItems.find((item) =>
      selectedItems.includes(item.id)
    );
    if (firstSelectedItem) {
      navigate(`/pay/${firstSelectedItem.productId}`);
    }
  };

  // 获取已购买的商品（这里模拟，实际应该从订单数据获取）
  const purchasedItems = []; // 可以从订单历史中获取

  if (cartItems.length === 0 && purchasedItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <Card className="cart-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="购物车为空"
            >
              <Button type="primary" onClick={() => navigate("/homepage")}>
                去逛逛
              </Button>
            </Empty>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <Title level={2} className="page-title">
          我的购物车
        </Title>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card title="购物车商品" className="cart-section">
              {cartItems.length > 0 ? (
                <>
                  <div className="cart-header">
                    <Checkbox
                      checked={selectedItems.length === cartItems.length}
                      onChange={toggleSelectAll}
                    >
                      全选
                    </Checkbox>
                    <Text>商品信息</Text>
                    <Text>单价</Text>
                    <Text>数量</Text>
                    <Text>小计</Text>
                    <Text>操作</Text>
                  </div>

                  <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => {
                      const price = parseFloat(item.price.replace("¥", ""));
                      const subtotal = price * item.quantity;

                      return (
                        // 在购物车页面的 List 组件中修改图片渲染部分
                        <List.Item className="cart-item">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                          />

                          <div className="cart-item-info">
                            <img
                              src={
                                item.image ||
                                "https://via.placeholder.com/80x80?text=无图"
                              } // 新增：默认 src
                              alt={item.name}
                              width={80}
                              height={80}
                              style={{
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80x80?text=无图";
                              }}
                              loading="lazy" // 新增：懒加载
                            />

                            <div className="cart-item-details">
                              <Text strong>{item.name}</Text>
                              <Text type="secondary">{item.seller}</Text>
                            </div>
                          </div>

                          <Text className="cart-item-price">{item.price}</Text>

                          <div className="cart-item-quantity">
                            <Button
                              size="small"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Text className="quantity-display">
                              {item.quantity}
                            </Text>
                            <Button
                              size="small"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              +
                            </Button>
                          </div>

                          <Text className="cart-item-subtotal" type="danger">
                            ¥{subtotal.toFixed(2)}
                          </Text>

                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeItem(item.id)}
                          />
                        </List.Item>
                      );
                    }}
                  />
                </>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span>
                      购物车为空，快去 <Link to="/homepage">挑选商品</Link> 吧！
                    </span>
                  }
                >
                  <Button type="primary" onClick={() => navigate("/homepage")}>
                    去逛逛
                  </Button>
                </Empty>
              )}
            </Card>
          </Col>

          {/* 已购买商品 */}
          {purchasedItems.length > 0 && (
            <Col span={24}>
              <Card title="已购买商品" className="purchased-section">
                <List
                  grid={{ gutter: 16, column: 4 }}
                  dataSource={purchasedItems}
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        className="purchased-item"
                        cover={
                          <Image
                            src={item.image}
                            alt={item.name}
                            width="100%"
                            preview={false}
                          />
                        }
                      >
                        <Card.Meta
                          title={item.name}
                          description={
                            <Space direction="vertical" size={0}>
                              <Text type="danger">{item.price}</Text>
                              <Text type="secondary">已购买</Text>
                            </Space>
                          }
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          )}

          {/* 结算栏 */}
          <Col span={24}>
            <Card className="checkout-section">
              <div className="checkout-summary">
                <Space>
                  <Checkbox
                    checked={selectedItems.length === cartItems.length}
                    onChange={toggleSelectAll}
                  >
                    全选
                  </Checkbox>
                  <Text>已选 {selectedItems.length} 件商品</Text>
                </Space>

                <div className="checkout-actions">
                  <Text className="total-price">
                    总价:{" "}
                    <Text type="danger">
                      ¥{calculateTotalPrice().toFixed(2)}
                    </Text>
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    去结算
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
