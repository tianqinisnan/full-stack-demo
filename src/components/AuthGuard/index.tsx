import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userStorage } from '@src/utils/storage';

// 不需要登录就能访问的路由
const PUBLIC_ROUTES = ['/login', '/verification', '/set-nickname'];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查是否是公开路由
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  // 如果是公开路由，直接显示内容
  if (isPublicRoute) {
    return <>{children}</>;
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        // 添加50ms延时，确保localStorage的读取是最新的
        await new Promise(resolve => setTimeout(resolve, 50));
        const isLoggedIn = userStorage.isLoggedIn();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error('验证登录状态失败:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // 如果正在检查认证状态，显示加载状态
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        加载中...
      </div>
    );
  }

  // 如果未登录且不是公开路由，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已登录，显示受保护的路由内容
  return <>{children}</>;
};

export default AuthGuard; 