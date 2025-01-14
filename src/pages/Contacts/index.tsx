import React from 'react';
import TabBar from '@src/components/TabBar';
import styles from './style.module.css';

const ContactsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>通讯录</h1>
      <div className={styles.content}>
        {/* 通讯录内容 */}
      </div>
      <TabBar />
    </div>
  );
};

export default ContactsPage; 