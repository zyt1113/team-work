import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  message,
  Tabs,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { schools } from "../Data/products";

const { Title } = Typography;
const { TabPane } = Tabs;

const USER_STORAGE_KEY = "deal_users";
const CURRENT_USER_KEY = "current_user";

// 用户管理辅助函数
const userManager = {
  // 获取所有用户
  getUsers: () => {
    const usersStr = localStorage.getItem(USER_STORAGE_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  // 添加新用户
  addUser: (userData) => {
    const users = userManager.getUsers();
    // 检查用户名是否已存在
    const existingUser = users.find(
      (user) => user.username === userData.username
    );
    if (existingUser) {
      throw new Error("用户名已存在");
    }

    // 添加新用户
    const newUser = {
      id: Date.now(),
      ...userData,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  // 验证用户登录
  validateUser: (username, password) => {
    const users = userManager.getUsers();
    return users.find(
      (user) => user.username === username && user.password === password
    );
  },

  // 设置当前用户
  setCurrentUser: (user) => {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        school_id: user.school_id,
      })
    );
  },

  // 获取当前用户
  getCurrentUser: () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // 清除当前用户（退出登录）
  clearCurrentUser: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // 登录接口
  /*nst login = async (values) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          school_id: values.school,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("登录成功！");
        // 保存token到localStorage或sessionStorage
        localStorage.setItem("authToken", data.token);
        navigate("/homepage");
      } else {
        message.error(data.message || "登录失败！");
      }
    } catch (error) {
      message.error("网络错误，请稍后重试！");
    }
  };

  // 注册接口
  const register = async (values) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
          school_id: values.school,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("注册成功！请登录");
        setActiveTab("login");
      } else {
        message.error(data.message || "注册失败！");
      }
    } catch (error) {
      message.error("网络错误，请稍后重试！");
    }
  };*/

  const onFinishLogin = (values) => {
    setLoading(true);

    // 使用setTimeout模拟网络延迟
    setTimeout(() => {
      setLoading(false);

      try {
        // 使用本地存储验证用户
        const user = userManager.validateUser(values.username, values.password);

        if (user) {
          message.success("登录成功！");
          userManager.setCurrentUser(user);
          localStorage.setItem("authToken", "local-token-" + Date.now());
          navigate("/homepage");
        } else {
          message.error("用户名或密码错误！");
        }
      } catch (error) {
        message.error(error.message || "登录失败！");
      }
    }, 500); // 模拟网络延迟
  };

  const onFinishRegister = (values) => {
    setLoading(true);

    // 使用setTimeout模拟网络延迟
    setTimeout(() => {
      setLoading(false);

      try {
        // 确认密码验证
        if (values.password !== values.confirmPassword) {
          message.error("两次输入的密码不一致！");
          return;
        }

        // 使用本地存储创建用户
        const newUser = userManager.addUser({
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
          school_id: values.school,
        });

        message.success("注册成功！请登录");
        setActiveTab("login");
      } catch (error) {
        message.error(error.message || "注册失败！");
      }
    }, 500); // 模拟网络延迟
  };

  return (
    <div className="login-page">
      <div className="header-title">
        <Title level={1} className="main-title">
          Deal一下
        </Title>
        <p className="subtitle">大小杂物，只要Deal一下</p>
      </div>

      <div className="login-container">
        <Card className="login-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="用户登录" key="login">
              <Form
                name="login"
                initialValues={{
                  school: schools[0].id,
                  username: "114514",
                  password: "1919519",
                }}
                onFinish={onFinishLogin}
              >
                <Form.Item
                  name="school"
                  label="选择学校"
                  rules={[{ required: true, message: "请选择学校!" }]}
                >
                  <Select>
                    {schools.map((school) => (
                      <Select.Option key={school.id} value={school.id}>
                        {school.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="username"
                  label="账号"
                  rules={[{ required: true, message: "请输入账号!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入账号" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: true, message: "请输入密码!" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="login-button"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="用户注册" key="register">
              <Form
                name="register"
                initialValues={{
                  school: schools[0].id,
                }}
                onFinish={onFinishRegister}
              >
                <Form.Item
                  name="school"
                  label="选择学校"
                  rules={[{ required: true, message: "请选择学校!" }]}
                >
                  <Select>
                    {schools.map((school) => (
                      <Select.Option key={school.id} value={school.id}>
                        {school.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[
                    { required: true, message: "请输入用户名!" },
                    { min: 3, message: "用户名至少3个字符!" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: "请输入邮箱!" },
                    { type: "email", message: "请输入有效的邮箱地址!" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[
                    { required: true, message: "请输入手机号!" },
                    {
                      pattern: /^1[3-9]\d{9}$/,
                      message: "请输入有效的手机号!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="请输入手机号"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: "请输入密码!" },
                    { min: 6, message: "密码至少6个字符!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "请确认密码!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("两次输入的密码不一致!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请再次输入密码"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="login-button"
                  >
                    注册
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
