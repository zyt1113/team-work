// src/Pages/Login.jsx
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
import { getAllSchools, addCustomSchool } from "../Data/products";

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

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

    // 检查邮箱是否已存在
    const existingEmail = users.find((user) => user.email === userData.email);
    if (existingEmail) {
      throw new Error("邮箱已被注册");
    }

    // 检查手机号是否已存在
    const existingPhone = users.find((user) => user.phone === userData.phone);
    if (existingPhone) {
      throw new Error("手机号已被注册");
    }

    // 添加新用户
    // src/Pages/Login.jsx 中的 addUser 方法
    const newUser = {
      id: Date.now(),
      username: userData.username,
      password: userData.password, // 实际项目中应该加密
      email: userData.email,
      phone: userData.phone,
      school_id: userData.school_id,
      school_name: userData.school_name,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(), // 添加最后登录时间
      avatar: null, // 可以添加头像
      nickname: userData.username, // 可以添加昵称
    };

    users.push(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  // 验证用户登录 - 支持用户名、邮箱、手机号登录
  validateUser: (identifier, password) => {
    const users = userManager.getUsers();

    // 自动检测输入类型
    if (/^1[3-9]\d{9}$/.test(identifier)) {
      // 手机号登录
      return users.find(
        (user) => user.phone === identifier && user.password === password
      );
    } else if (identifier.includes("@")) {
      // 邮箱登录
      return users.find(
        (user) => user.email === identifier && user.password === password
      );
    } else {
      // 用户名登录
      return users.find(
        (user) => user.username === identifier && user.password === password
      );
    }
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
  const [schools, setSchools] = useState(getAllSchools());
  const [showCustomSchoolInput, setShowCustomSchoolInput] = useState(false);
  const [customSchool, setCustomSchool] = useState("");
  const navigate = useNavigate();

  const onFinishLogin = (values) => {
    setLoading(true);

    // 使用setTimeout模拟网络延迟
    setTimeout(() => {
      setLoading(false);

      try {
        // 使用本地存储验证用户 - 支持用户名、邮箱、手机号登录
        const user = userManager.validateUser(values.username, values.password);

        if (user) {
          message.success("登录成功！");
          userManager.setCurrentUser(user);
          localStorage.setItem("authToken", "local-token-" + Date.now());
          navigate("/homepage");
        } else {
          message.error("账号或密码错误！");
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

        // 处理学校选择
        let schoolId = values.school;
        let schoolName = "";

        // 如果选择了自定义学校选项
        if (values.school === "custom") {
          if (!customSchool.trim()) {
            message.error("请输入自定义学校名称！");
            return;
          }

          // 添加自定义学校
          const newSchool = addCustomSchool(customSchool.trim());
          if (!newSchool) {
            message.error("该学校已存在！");
            return;
          }

          schoolId = newSchool.id;
          schoolName = newSchool.name;

          // 更新学校列表
          setSchools(getAllSchools());
          setShowCustomSchoolInput(false);
          setCustomSchool("");
        } else {
          // 获取选中学校的名称
          const selectedSchool = schools.find(
            (school) => school.id === values.school
          );
          if (selectedSchool) {
            schoolName = selectedSchool.name;
          }
        }

        // 使用本地存储创建用户
        const newUser = userManager.addUser({
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
          school_id: schoolId,
          school_name: schoolName,
        });

        message.success("注册成功！请登录");
        setActiveTab("login");
      } catch (error) {
        message.error(error.message || "注册失败！");
      }
    }, 500); // 模拟网络延迟
  };

  // 处理学校选择变化
  const handleSchoolChange = (value) => {
    if (value === "custom") {
      setShowCustomSchoolInput(true);
    } else {
      setShowCustomSchoolInput(false);
      setCustomSchool("");
    }
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
                  school: schools[0]?.id || null,
                  username: "",
                  password: "",
                }}
                onFinish={onFinishLogin}
              >
                <Form.Item
                  name="school"
                  label="选择学校"
                  rules={[{ required: true, message: "请选择学校!" }]}
                >
                  <Select onChange={handleSchoolChange}>
                    {schools.map((school) => (
                      <Option key={school.id} value={school.id}>
                        {school.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="username"
                  label="账号/邮箱/手机号"
                  rules={[
                    { required: true, message: "请输入账号/邮箱/手机号!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入账号/邮箱/手机号"
                  />
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
                  school: schools[0]?.id || null,
                }}
                onFinish={onFinishRegister}
              >
                <Form.Item
                  name="school"
                  label="选择学校"
                  rules={[{ required: true, message: "请选择学校!" }]}
                >
                  <Select onChange={handleSchoolChange}>
                    {schools.map((school) => (
                      <Option key={school.id} value={school.id}>
                        {school.name}
                      </Option>
                    ))}
                    <Option value="custom">+ 添加自定义学校</Option>
                  </Select>
                </Form.Item>

                {showCustomSchoolInput && (
                  <Form.Item
                    label="自定义学校名称"
                    rules={[{ required: true, message: "请输入学校名称!" }]}
                  >
                    <Input
                      value={customSchool}
                      onChange={(e) => setCustomSchool(e.target.value)}
                      placeholder="请输入学校名称"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[
                    { required: true, message: "请输入用户名!" },
                    { min: 1, message: "用户名不能为空!" },
                    { max: 20, message: "用户名长度不能超过20个字符!" },
                    { pattern: /^\S+$/, message: "用户名不能包含空格!" },
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
