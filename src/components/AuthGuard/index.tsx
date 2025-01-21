import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userStorage } from '@src/utils/storage';

// 不需要登录就能访问的路由
const PUBLIC_ROUTES = ['/login'];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  
  // 检查是否是公开路由
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  
  // 同步检查登录状态
  const isAuthenticated = userStorage.isLoggedIn();

  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }

  // 未登录且不是公开路由，重定向到登录页
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AuthGuard; 