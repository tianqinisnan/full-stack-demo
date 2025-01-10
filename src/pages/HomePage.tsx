import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
`;

const HomePage: React.FC = () => {
  return (
    <Container>
      <Title>欢迎来到首页</Title>
      <p>登录成功！</p>
    </Container>
  );
};

export default HomePage; 