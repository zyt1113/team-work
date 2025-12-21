// 创建一个通用的图片组件 ImageWithFallback.jsx
import React from "react";

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = "https://via.placeholder.com/300x300?text=图片加载失败",
  ...props
}) => {
  const handleError = (e) => {
    if (e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  };

  return (
    <img src={src || fallbackSrc} alt={alt} onError={handleError} {...props} />
  );
};

export default ImageWithFallback;
