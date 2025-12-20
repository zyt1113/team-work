// src/Components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button, Avatar } from "antd";
import { UserOutlined, MessageOutlined, PlusOutlined } from "@ant-design/icons";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);

  // 处理菜单项点击事件
  const handleMenuClick = (e) => {
    if (e.key === "5") {
      // 退出登录
      handleLogout();
    } else if (e.key === "1") {
      // 个人资料
      navigate("/user");
    } else if (e.key === "2") {
      // 我的订单
      navigate("/orders");
    }
    // 关闭下拉菜单
    setUserDropdownVisible(false);
  };

  // 退出登录函数
  const handleLogout = () => {
    // 清除本地存储的用户信息和认证令牌
    localStorage.removeItem("authToken");
    localStorage.removeItem("current_user");

    // 跳转到登录页面
    navigate("/login");
  };

  const userMenu = {
    items: [
      { key: "1", label: "个人资料" },
      { key: "2", label: "我的订单" },
      { key: "3", label: "" },
      { key: "4", label: "" },
      { type: "divider" },
      { key: "5", label: "退出登录" },
    ],
  };

  const navItems = [
    { key: "/homepage", label: "首页", path: "/homepage" },
    { key: "/cart", label: "购物车", path: "/cart" },
    { key: "/orders", label: "订单", path: "/orders" },
    { key: "/user", label: "用户", path: "/user" },
  ];

  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="logo">Deal</div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="nav-links"
          items={navItems.map((item) => ({
            key: item.key,
            label: <Link to={item.path}>{item.label}</Link>,
          }))}
        />
      </div>
      <div className="nav-right">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/sell")}
          style={{ marginRight: 16 }}
        >
          出售闲置
        </Button>
        <Dropdown
          menu={{
            items: userMenu.items,
            onClick: handleMenuClick,
          }}
          trigger={["click"]}
          open={userDropdownVisible}
          onOpenChange={setUserDropdownVisible}
        >
          <div className="user-trigger">
            <Avatar
              icon={<UserOutlined />}
              size="Large"
              className="user-avatar"
            />
            <span style={{ marginLeft: 8 }}>用户</span>
          </div>
        </Dropdown>
        <Button type="text" icon={<MessageOutlined />} />
      </div>
    </div>
  );
};

export default Navbar;
