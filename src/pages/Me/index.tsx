import React from 'react';
import TabBar from '@src/components/TabBar';
import styles from './style.module.css';

const MePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>我的</h1>
      <div className={styles.content}>
        {/* 个人中心内容 */}
      </div>
      <TabBar />
    </div>
  );
};

export default MePage; 