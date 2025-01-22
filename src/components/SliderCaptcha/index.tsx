import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './style.module.css';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const imageSrc = '/test/license_back.jpg';

const SliderCaptcha: React.FC<Props> = ({ onSuccess, onClose }) => {
  const [sliderLeft, setSliderLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const targetPosition = useRef(Math.floor(Math.random() * 150) + 100).current;

  // 处理滑块移动的公共逻辑
  const handleSliderMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current || !sliderRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    let newLeft = clientX - containerRect.left - sliderRef.current.offsetWidth / 2;
    
    // 限制滑块的移动范围
    const maxLeft = containerRect.width - sliderRef.current.offsetWidth;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    setSliderLeft(newLeft);
  }, [isDragging]);

  // 处理滑块释放的公共逻辑
  const handleSliderRelease = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // 判断是否滑到正确位置
    if (Math.abs(sliderLeft - targetPosition) < 5) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 300);
    } else {
      setSliderLeft(0);
    }
  }, [isDragging, sliderLeft, targetPosition, onSuccess]);

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSuccess) return;
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    handleSliderMove(e.clientX);
  }, [handleSliderMove]);

  const handleMouseUp = useCallback(() => {
    handleSliderRelease();
  }, [handleSliderRelease]);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSuccess) return;
    setIsDragging(true);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleSliderMove(e.touches[0].clientX);
  }, [handleSliderMove]);

  const handleTouchEnd = useCallback(() => {
    handleSliderRelease();
  }, [handleSliderRelease]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className={styles.modal}>
      <div className={styles.captchaContainer}>
        <div className={styles.closeBtn} onClick={onClose}>×</div>
        <div className={styles.title}>请完成安全验证</div>
        <div className={styles.imageContainer} ref={containerRef}>
          {/* 背景图片 */}
          <div 
            className={styles.bgImage} 
            style={{
              backgroundImage: `url(${imageSrc})`
            }}
          />
          {/* 目标缺口 */}
          <div 
            className={styles.puzzlePiece}
            style={{ 
              left: `${targetPosition}px`,
              backgroundPosition: `-${targetPosition}px -50px`
            }}
          />
          {/* 跟随滑块的拼图块 */}
          <div 
            className={styles.slidingPuzzlePiece}
            style={{ 
              left: `${sliderLeft}px`,
              backgroundPosition: `-${targetPosition}px -50px`,
              backgroundImage: `url(${imageSrc})`
            }}
          />
          {/* 滑动条 */}
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrack} />
            <div
              ref={sliderRef}
              className={`${styles.slider} ${isSuccess ? styles.success : ''}`}
              style={{ left: `${sliderLeft}px` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {isSuccess ? '√' : '→'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderCaptcha; 