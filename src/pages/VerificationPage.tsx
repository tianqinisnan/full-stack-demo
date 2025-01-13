import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { VerificationInput } from '../components/VerificationInput';
import styles from './VerificationPage.module.css';

const VerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const phone = location.state?.phone;

  if (!phone) {
    navigate('/login');
    return null;
  }

  const handleCodeChange = (value: string) => {
    setCode(value);
    setError('');
  };

  const handleVerify = async (vCode?: string) => {
    try {
      await apiService.verifyCode(phone, vCode || code);
      navigate('/home');
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