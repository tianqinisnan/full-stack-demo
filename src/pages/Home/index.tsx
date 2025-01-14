import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '@src/services/api';
import { parseQuery } from '@src/types/route';
import { userStorage } from '@src/utils/storage';
import TabBar from '@src/components/TabBar';
import styles from './style.module.css';

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string>('');
  
  // 从 storage 获取手机号
  const phone = userStorage.getPhone();
  
  // 从 URL 获取可分享信息
  const query = parseQuery(location.search);
  const urlNickname = query.nickname;

  useEffect(() => {
    // 没有手机号，说明未登录
    if (!phone) {
      navigate('/login', { replace: true });
      return;
    }
    
    // 如果有 URL 中的昵称参数，直接使用
    if (urlNickname) {
      setNickname(urlNickname);
      return;
    }

    // 获取用户信息
    const fetchUserInfo = async () => {
      try {
        const response = await apiService.getUserInfo(phone);
        if (response.data) {
          setNickname(response.data.nickname);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchUserInfo();
  }, [phone, urlNickname, navigate]);

  // 生成分享链接
  const shareUrl = `${window.location.origin}/home?nickname=${encodeURIComponent(nickname)}`;

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>欢迎来到首页</h1>
      <div className={styles.content}>
        <p className={styles.welcome}>你好，{nickname || '用户'}！</p>
        {nickname && (
          <div className={styles.share}>
            <p>分享这个页面：</p>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className={styles.shareInput}
              onClick={e => (e.target as HTMLInputElement).select()}
            />
          </div>
        )}
      </div> */}
      <TabBar />
    </div>
  );
};

export default HomePage; 