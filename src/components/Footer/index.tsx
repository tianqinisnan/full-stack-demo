import React from 'react';
import TabBar from '../TabBar';
import styles from './style.module.css';

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <TabBar />
    </div>
  );
};

export default Footer; 