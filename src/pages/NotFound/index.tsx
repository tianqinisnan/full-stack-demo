import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/home', { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <div className={styles.text}>页面不存在</div>
        <button className={styles.button} onClick={handleBackHome}>
          返回首页
        </button>
      </div>
    </div>
  );
};

export default NotFound; 