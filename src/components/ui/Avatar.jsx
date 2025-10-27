import React from "react";
import defaultAvatar from "@/assets/images/default-avatar.png";

export const Avatar = ({ src, alt = "User Avatar", size = 40, title = "" }) => {
  const imageSrc = src || defaultAvatar;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="rounded-full object-cover border border-gray-300"
      title={title}
      style={{ width: size, height: size }}
    />
  );
};
