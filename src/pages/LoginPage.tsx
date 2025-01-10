import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../services/api';

const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid #dcdee0;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #1989fa;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 44px;
  background-color: #1989fa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    background-color: #a0cfff;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  margin-bottom: 16px;
  font-size: 14px;
`;

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
    <Container>
      <Title>登录</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="tel"
        placeholder="请输入手机号"
        value={phone}
        onChange={handlePhoneChange}
      />
      <Button
        onClick={handleSendCode}
        disabled={!isPhoneValid || countdown > 0}
      >
        {countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码'}
      </Button>
    </Container>
  );
};

export default LoginPage; 