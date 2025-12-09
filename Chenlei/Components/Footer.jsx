import React from "react";
import { Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const Footer = () => {
  const footerLinks = [
    {
      title: "购物指南",
      links: ["购物流程", "会员介绍", "生活旅行", "常见问题", "联系客服"],
    },
    {
      title: "配送方式",
      links: ["免运费政策", "海外配送", "EMS", "211限时达", "售后政策"],
    },
    {
      title: "支付方式",
      links: ["货到付款", "在线支付", "分期付款", "邮局汇款", "公司转账"],
    },
    {
      title: "关于我们",
      links: ["关于我们", "联系我们", "合作招商", "商家帮助", "营销中心"],
    },
  ];

  return (
    <div className="footer">
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          {footerLinks.map((column, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Title level={4}>{column.title}</Title>
              <ul>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
        <div className="footer-bottom">
          <Text type="secondary">
            © 2023 Deal一下 版权所有 | 大小杂物，只要Deal一下
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Footer;
