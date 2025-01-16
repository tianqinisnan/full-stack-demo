import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '@src/components/AuthGuard';
import Login from '@src/pages/Login';
import Verification from '@src/pages/Verification';
import SetNickname from '@src/pages/SetNickname';
import Home from '@src/pages/Home';
import Contacts from '@src/pages/Contacts';
import Discover from '@src/pages/Discover';
import Me from '@src/pages/Me';
import Chat from '@src/pages/Chat';
import ChatRoom from '@src/pages/Chat/ChatRoom';

const AppRoutes: React.FC = () => {
  return (
    <AuthGuard>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/me" element={<Me />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/set-nickname" element={<SetNickname />} />
      </Routes>
    </AuthGuard>
  );
};

export default AppRoutes;