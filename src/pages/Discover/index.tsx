import React from 'react';
import TabBar from '@src/components/TabBar';
import styles from './style.module.css';

const DiscoverPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>发现</h1>
      <div className={styles.content}>
        {/* 发现页内容 */}
      </div>
      <TabBar />
    </div>
  );
};

export default DiscoverPage; 