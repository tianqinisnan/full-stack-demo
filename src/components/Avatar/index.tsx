import React, { useEffect, useRef } from 'react';
import styles from './style.module.css';
import { getFullUrl } from '@src/utils/url';

interface AvatarProps {
  nickname: string;
  avatarUrl?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ nickname = '用户', avatarUrl, size = 40 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 如果有头像 URL，直接显示图片
  if (avatarUrl) {
    return (
      <img
        src={getFullUrl(avatarUrl)}
        alt={nickname}
        className={styles.avatar}
        style={{ width: size, height: size }}
      />
    );
  }

  // 根据昵称生成随机颜色
  const getRandomColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 85%, 55%)`; // 增加饱和度和亮度，使颜色更鲜艳
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小（使用2倍大小以支持高清屏）
    const scale = window.devicePixelRatio || 1;
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);

    // 绘制圆形背景（浅灰色）
    ctx.fillStyle = '#F5F5F5';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // 设置文字样式
    const displayText = nickname || '用户';
    ctx.fillStyle = getRandomColor(nickname || '用户'); // 文字使用随机颜色
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 计算可用宽度（留出20%的边距）
    const maxWidth = size * 0.8;

    // 动态计算合适的字体大小
    let fontSize = size * 0.3;
    ctx.font = `${fontSize}px Arial`;
    let textWidth = ctx.measureText(displayText).width;
    
    // 调整字体大小以适应可用宽度
    while (textWidth > maxWidth) {
      fontSize -= 0.5;
      ctx.font = `${fontSize}px Arial`;
      textWidth = ctx.measureText(displayText).width;
    }

    // 绘制文字（考虑高清屏缩放）
    ctx.fillText(displayText, size / 2, size / 2, maxWidth);
  }, [nickname, size]);

  return (
    <div className={styles.avatarWrapper} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        className={styles.avatar}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Avatar; 