// Footer.jsx
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
        {/* 服务链接区域 - 四列布局 */}
        <div className="footer-service-links">
          <Row gutter={[40, 32]}>
            {footerLinks.map((column, index) => (
              <Col xs={12} sm={6} key={index}>
                <div className="footer-column">
                  <Title level={4}>{column.title}</Title>
                  <ul>
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href="#">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 认证和合作伙伴区域 */}
        <div className="footer-certificates">
          <div className="certificate-list">
            <a href="#" className="certificate-item">
              <img
                src="https://via.placeholder.com/100x40?text=可信网站"
                alt="可信网站认证"
              />
            </a>
            <a href="#" className="certificate-item">
              <img
                src="https://via.placeholder.com/100x40?text=网络警察"
                alt="网络警察"
              />
            </a>
            <a href="#" className="certificate-item">
              <img
                src="https://via.placeholder.com/100x40?text=诚信经营"
                alt="诚信经营"
              />
            </a>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="footer-bottom">
          <div className="footer-info">
            <p>
              <Text type="secondary">
                © 2023 Deal一下 版权所有 | 大小杂物，只要Deal一下
              </Text>
            </p>
            <p className="footer-links">
              <a href="#">法律声明</a>
              <span className="separator">|</span>
              <a href="#">隐私政策</a>
              <span className="separator">|</span>
              <a href="#">用户协议</a>
              <span className="separator">|</span>
              <a href="#">网站地图</a>
            </p>
          </div>

          {/* 联系方式 */}
          <div className="footer-contact">
            <p>
              客服热线：<Text type="warning">400-888-8888</Text>
            </p>
            <p>服务时间：周一至周日 9:00-21:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
