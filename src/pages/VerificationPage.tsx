import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const PhoneNumber = styled.div`
  text-align: center;
  color: #666;
  margin-bottom: 20px;
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

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleVerify = async () => {
    try {
      await apiService.verifyCode(phone, code);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    }
  };

  const isCodeValid = code.length === 6;

  return (
    <Container>
      <Title>验证码</Title>
      <PhoneNumber>验证码已发送至：{phone}</PhoneNumber>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="tel"
        placeholder="请输入验证码"
        value={code}
        onChange={handleCodeChange}
        maxLength={6}
      />
      <Button onClick={handleVerify} disabled={!isCodeValid}>
        验证
      </Button>
    </Container>
  );
};

export default VerificationPage; 