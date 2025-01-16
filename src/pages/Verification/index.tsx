import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '@src/services/api';
import { VerificationInput } from '@src/components/VerificationInput';
import styles from './style.module.css';
import { buildQuery } from '@src/types/route';
import { userStorage } from '@src/utils/storage';

const VerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    setError('');
  };

  const handleVerify = async (vCode?: string) => {
    try {
      const response = await apiService.verifyCode(phone, vCode || code);
      const { isNewUser, nickname } = response.data || {};
      
      // 存储手机号
      userStorage.setPhone(phone);
      
      if (isNewUser) {
        // 如果是新用户，跳转到设置昵称页面
        const defaultNickname = `${phone.slice(0, 3)}****${phone.slice(-4)}`;
        navigate('/set-nickname', { state: { defaultNickname } });
      } else {
        // 如果是老用户，直接跳转到首页
        const query = buildQuery({ nickname });
        navigate(`/home?${query}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    }
  };

  const isCodeValid = code.length === 6;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>验证码</h2>
      <div className={styles.phoneNumber}>验证码已发送至：{phone}</div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <VerificationInput
        onChange={handleCodeChange}
        onComplete={handleVerify}
        autoFocus
      />
      <button 
        className={styles.button} 
        onClick={() => handleVerify(code)} 
        disabled={!isCodeValid}
      >
        验证
      </button>
    </div>
  );
};

export default VerificationPage; 