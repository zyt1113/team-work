// a:\react\myapp1\src\Pages\UserPage.jsx
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  Button,
  List,
  message,
  Modal,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const { Title, Text } = Typography;
/*
 * API 接口说明:
 *
 * 1. 获取用户信息接口
 *    URL: /api/user/profile
 *    方法: GET
 *    请求头: Authorization: Bearer <token>
 *    响应数据:
 *      - username: 用户名
 *      - email: 邮箱
 *      - phone: 手机号
 *      - school: 学校名称
 *
 * 2. 更新用户信息接口
 *    URL: /api/user/profile
 *    方法: PUT
 *    请求头: Authorization: Bearer <token>
 *    请求参数:
 *      - username: 用户名
 *      - email: 邮箱
 *      - phone: 手机号
 *    响应数据:
 *      - message: 操作结果消息
 *
 * 3. 获取收货地址列表接口
 *    URL: /api/user/addresses
 *    方法: GET
 *    请求头: Authorization: Bearer <token>
 *    响应数据:
 *      - addresses: 地址列表
 *        - id: 地址ID
 *        - name: 收货人姓名
 *        - phone: 联系电话
 *        - address: 详细地址
 *        - isDefault: 是否为默认地址
 *
 * 4. 添加收货地址接口
 *    URL: /api/user/addresses
 *    方法: POST
 *    请求头: Authorization: Bearer <token>
 *    请求参数:
 *      - name: 收货人姓名
 *      - phone: 联系电话
 *      - address: 详细地址
 *      - isDefault: 是否设为默认地址
 *    响应数据:
 *      - message: 操作结果消息
 *
 * 5. 更新收货地址接口
 *    URL: /api/user/addresses/{id}
 *    方法: PUT
 *    请求头: Authorization: Bearer <token>
 *    请求参数:
 *      - name: 收货人姓名
 *      - phone: 联系电话
 *      - address: 详细地址
 *      - isDefault: 是否设为默认地址
 *    响应数据:
 *      - message: 操作结果消息
 *
 * 6. 删除收货地址接口
 *    URL: /api/user/addresses/{id}
 *    方法: DELETE
 *    请求头: Authorization: Bearer <token>
 *    响应数据:
 *      - message: 操作结果消息
 *
 * 7. 设置默认地址接口
 *    URL: /api/user/addresses/{id}/default
 *    方法: PUT
 *    请求头: Authorization: Bearer <token>
 *    响应数据:
 *      - message: 操作结果消息
 */
const UserPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  // 初始化用户信息
  /*
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 获取用户基本信息
        const profileResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const profileData = await profileResponse.json();
        
        // 获取用户地址信息
        const addressesResponse = await fetch('/api/user/addresses', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const addressesData = await addressesResponse.json();
        
        if (profileResponse.ok && addressesResponse.ok) {
          setUserInfo(profileData);
          setAddresses(addressesData.addresses);
        } else {
          message.error(profileData.message || addressesData.message || '获取用户数据失败');
        }
      } catch (error) {
        message.error('网络错误，请稍后重试！');
      }
    };
    
    fetchUserData();
  }, []);
  */
  useEffect(() => {
    // 从localStorage获取当前用户信息
    const currentUser = JSON.parse(localStorage.getItem("current_user")) || {};
    setUserInfo({
      username: currentUser.username || "用户名",
      email: currentUser.email || "example@email.com",
      phone: currentUser.phone || "138****8888",
      school: "北京大学", // 这里可以从currentUser.school_id获取对应学校名称
    });

    // 初始化地址信息
    const savedAddresses = JSON.parse(
      localStorage.getItem("user_addresses")
    ) || [
      {
        id: 1,
        name: "张三",
        phone: "13800138000",
        address: "北京市海淀区中关村大街1号北京大学宿舍楼A栋101室",
        isDefault: true,
      },
      {
        id: 2,
        name: "李四",
        phone: "13900139000",
        address: "北京市朝阳区望京SOHO T1楼2001室",
        isDefault: false,
      },
    ];
    setAddresses(savedAddresses);
  }, []);

  // 保存地址到localStorage
  const saveAddressesToStorage = (newAddresses) => {
    localStorage.setItem("user_addresses", JSON.stringify(newAddresses));
  };
  // 编辑个人信息
  /*
  const handleEditProfileAPI = async (values) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(values)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUserInfo({
          ...userInfo,
          ...values,
        });
        message.success(data.message || "个人信息更新成功");
        setIsEditModalVisible(false);
      } else {
        message.error(data.message || "更新失败");
      }
    } catch (error) {
      message.error('网络错误，请稍后重试！');
    }
  };
  */

  // 编辑个人信息
  const handleEditProfile = (values) => {
    setUserInfo({
      ...userInfo,
      ...values,
    });
    message.success("个人信息更新成功");
    setIsEditModalVisible(false);
  };
  // 设置默认地址
  /*
  const setDefaultAddressAPI = async (id) => {
    try {
      const response = await fetch(`/api/user/addresses/${id}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const updatedAddresses = addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }));
        setAddresses(updatedAddresses);
        saveAddressesToStorage(updatedAddresses);
        message.success(data.message || "默认地址设置成功");
      } else {
        message.error(data.message || "设置失败");
      }
    } catch (error) {
      message.error('网络错误，请稍后重试！');
    }
  };
  */

  // 设置默认地址
  const setDefaultAddress = (id) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    message.success("默认地址设置成功");
  };

  // 删除地址
  /*
  const deleteAddressAPI = async (id) => {
    if (addresses.length <= 1) {
      message.warning("至少需要保留一个地址");
      return;
    }

    const defaultAddr = addresses.find((addr) => addr.isDefault);
    if (defaultAddr && defaultAddr.id === id) {
      message.warning("不能删除默认地址");
      return;
    }

    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const updatedAddresses = addresses.filter((addr) => addr.id !== id);
        setAddresses(updatedAddresses);
        saveAddressesToStorage(updatedAddresses);
        message.success(data.message || "地址删除成功");
      } else {
        message.error(data.message || "删除失败");
      }
    } catch (error) {
      message.error('网络错误，请稍后重试！');
    }
  };
  */
  const deleteAddress = (id) => {
    if (addresses.length <= 1) {
      message.warning("至少需要保留一个地址");
      return;
    }

    const defaultAddr = addresses.find((addr) => addr.isDefault);
    if (defaultAddr && defaultAddr.id === id) {
      message.warning("不能删除默认地址");
      return;
    }

    const updatedAddresses = addresses.filter((addr) => addr.id !== id);
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    message.success("地址删除成功");
  };

  // 打开编辑地址模态框
  const openAddressModal = (address = null) => {
    setEditingAddress(address);
    setIsAddressModalVisible(true);

    if (address) {
      addressForm.setFieldsValue(address);
    } else {
      addressForm.resetFields();
    }
  };

  // 保存地址
  /*
  const handleSaveAddressAPI = async (values) => {
    try {
      let response, data;
      
      if (editingAddress) {
        // 更新地址
        response = await fetch(`/api/user/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(values)
        });
      } else {
        // 新增地址
        response = await fetch(`/api/user/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(values)
        });
      }
      
      data = await response.json();
      
      if (response.ok) {
        if (editingAddress) {
          // 更新地址
          const updatedAddresses = addresses.map((addr) =>
            addr.id === editingAddress.id ? { ...addr, ...values } : addr
          );
          setAddresses(updatedAddresses);
          saveAddressesToStorage(updatedAddresses);
        } else {
          // 新增地址
          const newAddress = {
            id: data.id || (addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1),
            ...values,
          };
          const updatedAddresses = [...addresses, newAddress];
          setAddresses(updatedAddresses);
          saveAddressesToStorage(updatedAddresses);
        }
        
        setIsAddressModalVisible(false);
        addressForm.resetFields();
        message.success(editingAddress ? (data.message || "地址更新成功") : (data.message || "地址添加成功"));
      } else {
        message.error(data.message || (editingAddress ? "更新失败" : "添加失败"));
      }
    } catch (error) {
      message.error('网络错误，请稍后重试！');
    }
  };
  */
  const handleSaveAddress = (values) => {
    let updatedAddresses;

    if (editingAddress) {
      // 更新地址
      updatedAddresses = addresses.map((addr) =>
        addr.id === editingAddress.id ? { ...addr, ...values } : addr
      );
    } else {
      // 新增地址
      const newAddress = {
        id:
          addresses.length > 0
            ? Math.max(...addresses.map((a) => a.id)) + 1
            : 1,
        ...values,
        isDefault: addresses.length === 0, // 如果是第一个地址，则设为默认
      };
      updatedAddresses = [...addresses, newAddress];
    }

    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    setIsAddressModalVisible(false);
    addressForm.resetFields();
    message.success(editingAddress ? "地址更新成功" : "地址添加成功");
  };

  return (
    <div>
      <Navbar />

      <div className="container" style={{ padding: "20px" }}>
        <Title level={2}>个人中心</Title>

        <Row gutter={[24, 24]}>
          {/* 个人信息卡片 */}
          <Col span={24}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>基本信息</span>
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditModalVisible(true)}
                >
                  编辑
                </Button>
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <Text strong>用户名：</Text>
                  <Text>{userInfo.username}</Text>
                </div>
                <div>
                  <Text strong>邮箱：</Text>
                  <Text>{userInfo.email}</Text>
                </div>
                <div>
                  <Text strong>手机：</Text>
                  <Text>{userInfo.phone}</Text>
                </div>
                <div>
                  <Text strong>学校：</Text>
                  <Text>{userInfo.school}</Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* 地址管理卡片 */}
          <Col span={24}>
            <Card
              title={
                <Space>
                  <EnvironmentOutlined />
                  <span>收货地址</span>
                </Space>
              }
              extra={
                <Button type="primary" onClick={() => openAddressModal()}>
                  新增收货地址
                </Button>
              }
            >
              <List
                dataSource={addresses}
                renderItem={(address) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => openAddressModal(address)}
                      >
                        编辑
                      </Button>,
                      !address.isDefault && (
                        <Button
                          type="link"
                          onClick={() => setDefaultAddress(address.id)}
                        >
                          设为默认
                        </Button>
                      ),
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteAddress(address.id)}
                      >
                        删除
                      </Button>,
                    ].filter(Boolean)}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{address.name}</Text>
                          {address.isDefault && (
                            <Text type="success">[默认]</Text>
                          )}
                        </Space>
                      }
                      description={
                        <div>
                          <div>{address.phone}</div>
                          <div>{address.address}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 编辑个人信息模态框 */}
      <Modal
        title="编辑个人信息"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={userInfo}
          onFinish={handleEditProfile}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入正确的邮箱格式" },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" },
            ]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setIsEditModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 地址管理模态框 */}
      <Modal
        title={editingAddress ? "编辑收货地址" : "新增收货地址"}
        open={isAddressModalVisible}
        onCancel={() => {
          setIsAddressModalVisible(false);
          setEditingAddress(null);
          addressForm.resetFields();
        }}
        footer={null}
      >
        <Form form={addressForm} layout="vertical" onFinish={handleSaveAddress}>
          <Form.Item
            name="name"
            label="收货人"
            rules={[{ required: true, message: "请输入收货人姓名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { required: true, message: "请输入联系电话" },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="详细地址"
            rules={[{ required: true, message: "请输入详细地址" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                onClick={() => {
                  setIsAddressModalVisible(false);
                  setEditingAddress(null);
                  addressForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
};

export default UserPage;
