import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '@src/services/api';
import { buildQuery } from '@src/types/route';
import { userStorage } from '@src/utils/storage';
import styles from './style.module.css';

const SetNicknamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { defaultNickname } = location.state || {};
  const [nickname, setNickname] = useState(defaultNickname || '');
  const [error, setError] = useState('');

  const phone = userStorage.getPhone();
  
  if (!phone) {
    navigate('/login');
    return null;
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      setError('昵称不能为空');
      return;
    }

    try {
      await apiService.updateNickname(phone, nickname);
      const query = buildQuery({ nickname });
      navigate(`/home?${query}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '设置昵称失败');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>设置昵称</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <input
        type="text"
        placeholder="请输入昵称"
        value={nickname}
        onChange={handleNicknameChange}
        className={styles.input}
        maxLength={50}
      />
      <button
        onClick={handleSubmit}
        className={styles.button}
      >
        确认
      </button>
    </div>
  );
};

export default SetNicknamePage; 