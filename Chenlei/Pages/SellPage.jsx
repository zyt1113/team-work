// src/Pages/SellPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Upload,
  message,
  Select,
  Row,
  Col,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SellPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 获取当前用户信息
    const user = JSON.parse(localStorage.getItem("current_user"));
    if (!user) {
      message.warning("请先登录");
      navigate("/login");
      return;
    }
    setCurrentUser(user);
  }, [navigate]);
  // 处理图片上传（模拟，优化：添加文件大小/类型检查）
  const handleUploadChange = ({ fileList }) => {
    // 限制最多上传5张图片，每张不超过2MB
    const validFiles = fileList.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
        message.error(`${file.name} 文件大小超过2MB`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 5) {
      message.warning("最多只能上传5张图片");
      return;
    }
    setFileList(validFiles);
  };

  // 提交表单（优化：确保至少一张图片）
  const onFinish = (values) => {
    if (fileList.length === 0) {
      message.error("请至少上传一张商品图片");
      return;
    }

    // 模拟上传图片并获取URL（优化：添加错误处理）
    const imageUrls = fileList.map((file, index) => {
      try {
        return (
          file.response?.url ||
          file.url ||
          `https://via.placeholder.com/300x300?text=商品图片${index + 1}`
        );
      } catch {
        return `https://via.placeholder.com/300x300?text=上传失败${index + 1}`;
      }
    });

    // 创建新商品对象（优化：确保 image 有值）
    const newProduct = {
      id: Date.now(),
      name: values.name,
      price: `¥${parseFloat(values.price).toFixed(2)}`,
      school: values.school || currentUser?.school_name || "未知学校",
      time: "刚刚发布",
      description: values.description,
      image: imageUrls[0] || "https://via.placeholder.com/300x300?text=无主图", // 优化：默认主图
      images: imageUrls,
      seller: {
        name: `${currentUser?.school_name || ""} ${
          currentUser?.username || "用户"
        }`,
        rating: "95%",
        avatar: (currentUser?.username || "用")[0],
      },
    };

    // 将新商品添加到本地存储的产品列表中
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    storedProducts.push(newProduct);
    localStorage.setItem("products", JSON.stringify(storedProducts));

    message.success("商品发布成功！");
    form.resetFields();
    setFileList([]);

    // 跳转到首页查看新发布的商品
    setTimeout(() => {
      navigate("/homepage");
    }, 1000);
  };

  return (
    <div>
      <Navbar />

      <div className="container" style={{ padding: "20px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          发布闲置商品
        </Title>

        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  name="name"
                  label="商品名称"
                  rules={[{ required: true, message: "请输入商品名称!" }]}
                >
                  <Input placeholder="请输入商品名称" />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="价格 (¥)"
                  rules={[{ required: true, message: "请输入商品价格!" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请输入价格"
                    min={0}
                    step={0.01}
                    formatter={(value) => `¥ ${value}`}
                    parser={(value) => value.replace(/¥\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="商品描述"
                  rules={[{ required: true, message: "请输入商品描述!" }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请详细描述商品的新旧程度、功能状况等信息"
                  />
                </Form.Item>

                <Form.Item name="school" label="所在学校">
                  <Select placeholder="请选择学校">
                    <Option value="北京大学">北京大学</Option>
                    <Option value="清华大学">清华大学</Option>
                    <Option value="复旦大学">复旦大学</Option>
                    <Option value="上海交通大学">上海交通大学</Option>
                    <Option value="浙江大学">浙江大学</Option>
                    <Option value="中国科学技术大学">中国科学技术大学</Option>
                    <Option value="南京大学">南京大学</Option>
                    <Option value="中山大学">中山大学</Option>
                    <Option value="华中科技大学">华中科技大学</Option>
                    <Option value="武汉大学">武汉大学</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="商品图片"
                  extra="最多上传5张图片，每张图片不超过2MB"
                >
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    multiple
                    beforeUpload={() => false} // 阻止自动上传
                  >
                    {fileList.length >= 5 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>

                <Divider />

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    发布商品
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default SellPage;
