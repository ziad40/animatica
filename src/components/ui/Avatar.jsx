import React, { useEffect, useState } from "react";
import defaultAvatar from "@/assets/images/default-avatar.png";

// Avatar supports an optional `hoverSrc` (e.g., a GIF). When provided the component
// will switch to `hoverSrc` on mouse enter and revert to `src` on mouse leave.
export const Avatar = ({ src, hoverSrc, alt = "User Avatar", size = 40, title }) => {
  const baseSrc = src || defaultAvatar;
  const [currentSrc, setCurrentSrc] = useState(baseSrc);

  // Preload hoverSrc (if any) to avoid flicker when switching
  useEffect(() => {
    if (!hoverSrc) return;
    const img = new Image();
    img.src = hoverSrc;
  }, [hoverSrc]);

  useEffect(() => {
    setCurrentSrc(baseSrc);
  }, [baseSrc]);

  const handleMouseEnter = () => {
    if (hoverSrc) setCurrentSrc(hoverSrc);
  };

  const handleMouseLeave = () => {
    setCurrentSrc(baseSrc);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      title={title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="rounded-full object-cover border border-gray-300"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;

