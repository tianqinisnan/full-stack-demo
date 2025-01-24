import React from 'react';
import { useLocation } from 'react-router-dom';
import { parseQuery } from '@src/types/route';
import ChatPage from '../Chat';
import styles from './style.module.css';

const HomePage: React.FC = () => {
  const location = useLocation();
  
  // 从 URL 获取可分享信息
  const query = parseQuery(location.search);
  const urlNickname = query.nickname;

  return (
    <div className={styles.container}>
      <ChatPage />
    </div>
  );
};

export default HomePage; 