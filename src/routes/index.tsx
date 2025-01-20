import React from 'react';
import { useRoutes } from 'react-router-dom';
import AuthGuard from '@src/components/AuthGuard';
import Layout from '@src/pages/Layout';
import Login from '@src/pages/Login';
import Verification from '@src/pages/Verification';
import SetNickname from '@src/pages/SetNickname';
import Home from '@src/pages/Home';
import Contacts from '@src/pages/Contacts';
import Discover from '@src/pages/Discover';
import Me from '@src/pages/Me';
import Chat from '@src/pages/Chat';
import ChatRoom from '@src/pages/Chat/ChatRoom';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  title?: string;
  header?: boolean;
  footer?: boolean;
}

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
        title: '首页',
        header: true,
        footer: true,
      },
      {
        path: 'home',
        element: <Home />,
        title: '首页',
        header: true,
        footer: true,
      },
      {
        path: 'contacts',
        element: <Contacts />,
        title: '通讯录',
        header: true,
        footer: true,
      },
      {
        path: 'discover',
        element: <Discover />,
        title: '发现',
        header: true,
        footer: true,
      },
      {
        path: 'me',
        element: <Me />,
        title: '我的',
        header: true,
        footer: true,
      },
      {
        path: 'chat',
        element: <Chat />,
        title: '消息',
        header: true,
        footer: false,
      },
      {
        path: 'chat/:id',
        element: <ChatRoom />,
        title: '聊天',
        header: true,
        footer: false,
      },
      {
        path: 'login',
        element: <Login />,
        header: false,
        footer: false,
      },
      {
        path: 'verification',
        element: <Verification />,
        header: false,
        footer: false,
      },
      {
        path: 'set-nickname',
        element: <SetNickname />,
        title: '设置昵称',
        header: false,
        footer: false,
      },
      {
        path: '*',
        element: <Home />,
        title: '首页',
        header: true,
        footer: true,
      }
    ]
  }
];

const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);
  return <AuthGuard>{element}</AuthGuard>;
};

export default AppRoutes;