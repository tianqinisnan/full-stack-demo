import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import AvatarUploader from '../../components/AvatarUploader';
import { apiService } from '@src/services/api';
import Toast from '@src/components/Toast';

const MePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{ nickname: string; avatarUrl?: string }>({ nickname: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getUserInfo();

        if (response.success && response.data) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error('Fetch user info error:', error);
        Toast.show('获取用户信息失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAvatarChange = async (url: string) => {
    try {
      await apiService.updateAvatar(url);
      setUserInfo(prev => ({ ...prev, avatarUrl: url }));
      Toast.show('头像更新成功');
    } catch (error) {
      console.error('Update avatar error:', error);
      Toast.show('头像更新失败');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>我的</h1>
      {!isLoading && (
        <div className={styles.content}>
          <div className={styles.avatarSection}>
            <AvatarUploader 
              defaultAvatar={userInfo.avatarUrl}
              onAvatarChange={handleAvatarChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MePage; 