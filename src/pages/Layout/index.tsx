import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@src/components/Header';
import Footer from '@src/components/Footer';
import SocketManager from '@src/components/SocketManager';
import { routes, RouteConfig } from '@src/routes';
import styles from './style.module.css';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // 获取当前路由的配置
  const getRouteConfig = (pathname: string): RouteConfig => {
    const mainRoute = routes[0]; // 获取主路由配置
    if (!mainRoute.children) return { path: pathname, element: null };

    // 处理带参数的路由
    if (pathname.startsWith('/chat/')) {
      return mainRoute.children.find(route => route.path === 'chat/:id') || { path: pathname, element: null };
    }

    // 移除开头的斜杠以匹配路由配置
    const path = pathname.replace(/^\//, '');
    return mainRoute.children.find(route => route.path === path) || 
           mainRoute.children.find(route => route.path === '*') || 
           { path: pathname, element: null };
  };

  const currentRoute = getRouteConfig(location.pathname);

  return (
    <div className={styles.layout}>
      <SocketManager />
      {currentRoute.header && (
        <>
          <Header title={currentRoute.title} />
          <div className={styles.headerPlaceholder} />
        </>
      )}
      <main className={styles.main}>
        <Outlet />
      </main>
      {currentRoute.footer && (
        <>
          <Footer />
          <div className={styles.footerPlaceholder} />
        </>
      )}
    </div>
  );
};

export default Layout; 