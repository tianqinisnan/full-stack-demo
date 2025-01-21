import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@src/services/api';
import { userStorage } from '@src/utils/storage';
import { VerificationInput } from '@src/components/VerificationInput';
import Toast from '@src/components/Toast';
import styles from './style.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isVerification, setIsVerification] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show('请输入正确的手机号');
      return;
    }

    try {
      const response = await apiService.sendVerificationCode(phone);
      if (response.success) {
        Toast.show('验证码已发送');
        setIsVerification(true);
        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      Toast.show('发送验证码失败，请重试');
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleVerify = async (vCode?: string) => {
    const verificationCode = vCode || code;
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      Toast.show('请输入6位验证码');
      return;
    }

    try {
      const response = await apiService.verifyCode(phone, verificationCode);
      if (response.success) {
        const { isNewUser, nickname } = response.data || {};
        userStorage.setPhone(phone);
        Toast.show('验证成功');
        
        if (isNewUser) {
          // 如果是新用户，跳转到设置昵称页面
          const defaultNickname = `${phone.slice(0, 3)}****${phone.slice(-4)}`;
          navigate('/set-nickname', { state: { defaultNickname } });
        } else {
          // 如果是老用户，直接跳转到首页
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('验证失败:', error);
      Toast.show('验证失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {isVerification ? '输入验证码' : '登录'}
        </h1>
        {!isVerification ? (
          <>
            <input
              type="tel"
              className={styles.input}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="请输入手机号"
              maxLength={11}
            />
            <button 
              className={styles.button}
              onClick={handleSendCode}
            >
              获取验证码
            </button>
          </>
        ) : (
          <>
            <div className={styles.phoneInfo}>
              验证码已发送至 {phone}
            </div>
            <VerificationInput
              onChange={handleCodeChange}
              onComplete={handleVerify}
              autoFocus
            />
            <button 
              className={styles.button}
              onClick={() => handleVerify()}
              disabled={code.length !== 6}
            >
              验证
            </button>
            {countdown > 0 ? (
              <div className={styles.countdown}>
                {countdown}秒后可重新发送
              </div>
            ) : (
              <div 
                className={styles.resend}
                onClick={handleSendCode}
              >
                重新发送验证码
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login; 