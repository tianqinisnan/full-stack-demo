import React from 'react';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>欢迎来到首页</h1>
      <p>登录成功！</p>
    </div>
  );
};

export default HomePage; 