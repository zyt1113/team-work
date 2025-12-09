import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Dropdown, Button, Avatar } from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";

const Navbar = () => {
  const location = useLocation();
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);

  const userMenu = {
    items: [
      { key: "1", label: "个人资料" },
      { key: "2", label: "我的订单" },
      { key: "3", label: "收货地址" },
      { key: "4", label: "账户设置" },
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
        <Dropdown
          menu={{ items: userMenu.items }}
          trigger={["click"]}
          open={userDropdownVisible}
          onOpenChange={setUserDropdownVisible}
        >
          <div className="user-trigger">
            <Avatar icon={<UserOutlined />} size="small" />
            <span style={{ marginLeft: 8 }}>用户</span>
          </div>
        </Dropdown>
        <Button type="text" icon={<MessageOutlined />} />
      </div>
    </div>
  );
};

export default Navbar;
