// a:\react\myapp1\src\Pages\OrdersPage.jsx
import React, { useState } from "react";
import {
  Table,
  Tabs,
  Tag,
  Button,
  Space,
  Card,
  Typography,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "20231101001",
      productName: "高等数学教材（第七版）",
      productImage:
        "https://bkimg.cdn.bcebos.com/pic/a50f4bfbfbedab643d90d10efa36afc378311e19?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
      price: "¥35.00",
      quantity: 1,
      total: "¥35.00",
      status: "completed",
      date: "2023-11-01",
      seller: "北京大学 张同学",
    },
    {
      id: "20231103002",
      productName: "AirPods Pro 二代",
      productImage:
        "https://static.turbosquid.com/Preview/2019/11/20__11_33_32/Apple_AirPods_Pro_04.jpgE9377B58-7C7E-4943-9425-82351D4D22C1DefaultHQ.jpg",
      price: "¥899.00",
      quantity: 1,
      total: "¥899.00",
      status: "shipped",
      date: "2023-11-03",
      seller: "清华大学 李同学",
    },
    {
      id: "20231105003",
      productName: "护眼LED台灯",
      productImage:
        "https://th.bing.com/th/id/OIP.i-Sl1nmRZAveDbbX6L1xJAHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
      price: "¥45.00",
      quantity: 2,
      total: "¥90.00",
      status: "pending",
      date: "2023-11-05",
      seller: "复旦大学 王同学",
    },
    {
      id: "20231102004",
      productName: "计算机考研专业课资料",
      productImage:
        "https://th.bing.com/th/id/OIP.LFixKQ_MtcD_J3pJfdRQ0QHaHa?w=164&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
      price: "¥120.00",
      quantity: 1,
      total: "¥120.00",
      status: "cancelled",
      date: "2023-11-02",
      seller: "上海交通大学 赵同学",
    },
  ]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "待付款",
          color: "orange",
          icon: <ClockCircleOutlined />,
        };
      case "shipped":
        return { text: "已发货", color: "blue", icon: <SyncOutlined spin /> };
      case "completed":
        return {
          text: "已完成",
          color: "green",
          icon: <CheckCircleOutlined />,
        };
      case "cancelled":
        return { text: "已取消", color: "red", icon: <CloseCircleOutlined /> };
      default:
        return { text: "未知状态", color: "default" };
    }
  };

  const handleViewOrder = (orderId) => {
    message.info(`查看订单 ${orderId} 的详细信息`);
  };

  const handleCancelOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
    message.success("订单已取消");
  };

  const handlePayOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "shipped" } : order
      )
    );
    message.success("支付成功");
  };

  const columns = [
    {
      title: "商品信息",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.productImage}
            alt={record.productName}
            style={{
              width: 60,
              height: 60,
              marginRight: 12,
              objectFit: "cover",
            }}
          />
          <div>
            <div>{record.productName}</div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              {record.seller}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "单价",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "实付款",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "订单状态",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = getStatusInfo(status);
        return (
          <Tag icon={statusInfo.icon} color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record.id)}
          >
            查看
          </Button>
          {record.status === "pending" && (
            <>
              <Button type="link" onClick={() => handlePayOrder(record.id)}>
                付款
              </Button>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleCancelOrder(record.id)}
              >
                取消
              </Button>
            </>
          )}
          {record.status === "shipped" && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setOrders(
                  orders.map((order) =>
                    order.id === record.id
                      ? { ...order, status: "completed" }
                      : order
                  )
                );
                message.success("确认收货成功");
              }}
            >
              确认收货
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getOrdersByStatus = (status) => {
    if (status === "all") return orders;
    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="orders-page" style={{ padding: "20px" }}>
      <Card>
        <Title level={3}>我的订单</Title>
        <Tabs defaultActiveKey="all">
          <TabPane tab="全部订单" key="all">
            <Table
              dataSource={getOrdersByStatus("all")}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          <TabPane tab="待付款" key="pending">
            <Table
              dataSource={getOrdersByStatus("pending")}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          <TabPane tab="待收货" key="shipped">
            <Table
              dataSource={getOrdersByStatus("shipped")}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          <TabPane tab="已完成" key="completed">
            <Table
              dataSource={getOrdersByStatus("completed")}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default OrdersPage;
