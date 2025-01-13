import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(value);
    setError('');
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    try {
      await apiService.sendVerificationCode(phone);
      startCountdown();
      navigate('/verification', { state: { phone } });
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败');
    }
  };

  const isPhoneValid = phone.length === 11;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>登录</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <input
        type="tel"
        placeholder="请输入手机号"
        value={phone}
        onChange={handlePhoneChange}
        className={styles.input}
      />
      <button
        onClick={handleSendCode}
        disabled={!isPhoneValid || countdown > 0}
        className={styles.button}
      >
        {countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码'}
      </button>
    </div>
  );
};

export default LoginPage; 