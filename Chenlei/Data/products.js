// src/Data/products.js
export const baseProducts = [
  {
    id: 1,
    name: "高等数学教材（第七版）",
    price: "¥35.00",
    school: "北京大学",
    time: "2小时前",
    description:
      "高等数学教材第七版，全新未拆封，正版书籍，内容详实，适合大学生学习使用。本书是同济大学数学系编写的经典教材，涵盖微积分、线性代数等内容。",
    image: "/OIP9.webp",
    seller: {
      name: "北京大学 张同学",
      rating: "98%",
      avatar: "北",
    },
  },
  {
    id: 2,
    name: "AirPods Pro 二代",
    price: "¥899.00",
    school: "清华大学",
    time: "5小时前",
    description:
      "AirPods Pro第二代，几乎全新，音质出色，降噪效果极佳，适合日常通勤和学习使用。",
    image: "/OIP8.jpg",
    seller: {
      name: "清华大学 李同学",
      rating: "95%",
      avatar: "清",
    },
  },
  {
    id: 3,
    name: "护眼LED台灯",
    price: "¥45.00",
    school: "复旦大学",
    time: "1天前",
    description:
      "高品质护眼LED台灯，无频闪，亮度可调，适合长时间学习使用。采用节能LED光源，使用寿命长。",
    image: "/OIP7.webp",
    seller: {
      name: "复旦大学 王同学",
      rating: "97%",
      avatar: "复",
    },
  },
  {
    id: 4,
    name: "计算机考研专业课资料",
    price: "¥120.00",
    school: "上海交通大学",
    time: "1天前",
    description:
      "包含数据结构、计算机组成原理、操作系统、计算机网络四门核心课程的历年真题和重点知识点总结，适用于计算机专业考研复习。",
    image: "/OIP6.webp",
    seller: {
      name: "上海交通大学 赵同学",
      rating: "96%",
      avatar: "上",
    },
  },
  {
    id: 5,
    name: "Nike运动鞋",
    price: "¥299.00",
    school: "浙江大学",
    time: "2天前",
    description:
      "Nike经典款运动鞋，穿着舒适，透气性好，适合跑步和日常运动。尺码42，九成新。",
    image: "/OIP5.webp",
    seller: {
      name: "浙江大学 陈同学",
      rating: "94%",
      avatar: "浙",
    },
  },
  {
    id: 6,
    name: "MacBook Pro 13寸",
    price: "¥8500.00",
    school: "中国科学技术大学",
    time: "3天前",
    description:
      "MacBook Pro 13英寸，2019款，Intel i5处理器，8GB内存，256GB固态硬盘，性能强劲，适合编程和设计工作。",
    image: "/OIP4.webp",
    seller: {
      name: "中国科学技术大学 刘同学",
      rating: "99%",
      avatar: "中",
    },
  },
  {
    id: 7,
    name: "宿舍收纳盒套装",
    price: "¥29.90",
    school: "南京大学",
    time: "3天前",
    description:
      "多功能宿舍收纳盒套装，包含衣物整理盒、桌面收纳盒等，帮助你打造整洁有序的生活空间。",
    image: "/OIP3.webp",
    seller: {
      name: "南京大学 孙同学",
      rating: "93%",
      avatar: "南",
    },
  },
  {
    id: 8,
    name: "Kindle电子书阅读器",
    price: "¥599.00",
    school: "中山大学",
    time: "4天前",
    description:
      "Kindle电子书阅读器，第八代，6英寸高清显示屏，内置阅读灯，轻便易携，保护眼睛，是阅读爱好者的理想选择。",
    image: "/OIP2.webp",
    seller: {
      name: "中山大学 周同学",
      rating: "96%",
      avatar: "中",
    },
  },
  {
    id: 9,
    name: "机械键盘",
    price: "¥199.00",
    school: "华中科技大学",
    time: "5天前",
    description:
      "87键机械键盘，青轴，手感清脆，响应迅速，适合编程和游戏使用。外观简约时尚，背光可调节。",
    image: "/OIP1.webp",
    seller: {
      name: "华中科技大学 吴同学",
      rating: "95%",
      avatar: "华",
    },
  },
  {
    id: 10,
    name: "小米手环6",
    price: "¥169.00",
    school: "武汉大学",
    time: "1周前",
    description:
      "小米手环6，1.56英寸AMOLED彩色屏幕，支持心率监测、睡眠监测、运动模式等多种功能，续航长达14天。",
    image: "/OIP.webp",
    seller: {
      name: "武汉大学 郑同学",
      rating: "92%",
      avatar: "武",
    },
  },
];

export const defaultSchools = [
  { id: 1, name: "北京大学" },
  { id: 2, name: "清华大学" },
  { id: 3, name: "复旦大学" },
  { id: 4, name: "上海交通大学" },
  { id: 5, name: "浙江大学" },
  { id: 6, name: "中国科学技术大学" },
  { id: 7, name: "南京大学" },
  { id: 8, name: "中山大学" },
  { id: 9, name: "华中科技大学" },
  { id: 10, name: "武汉大学" },
];

// 获取所有学校（包括用户自定义的）
export const getAllSchools = () => {
  const customSchools = JSON.parse(
    localStorage.getItem("custom_schools") || "[]"
  );
  return [...defaultSchools, ...customSchools];
};

// 添加自定义学校
export const addCustomSchool = (schoolName) => {
  const allSchools = getAllSchools();

  // 检查学校是否已经存在
  if (allSchools.some((school) => school.name === schoolName)) {
    return null;
  }

  const newSchool = {
    id: Date.now(), // 使用时间戳作为唯一ID
    name: schoolName,
  };

  const customSchools = JSON.parse(
    localStorage.getItem("custom_schools") || "[]"
  );
  customSchools.push(newSchool);
  localStorage.setItem("custom_schools", JSON.stringify(customSchools));

  return newSchool;
};

// 获取所有商品（包括发布的商品）
export const getAllProducts = () => {
  try {
    const userProducts = JSON.parse(localStorage.getItem("products")) || [];
    const allProducts = [...baseProducts, ...userProducts];
    // 优化：过滤并设置默认 image
    return allProducts.map((product) => ({
      ...product,
      image: product.image || "https://via.placeholder.com/300x150?text=无图片",
    }));
  } catch (e) {
    return baseProducts.map((product) => ({
      ...product,
      image: product.image || "https://via.placeholder.com/300x150?text=无图片",
    }));
  }
};
