import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@src/pages/Login';
import Verification from '@src/pages/Verification';
import SetNickname from '@src/pages/SetNickname';
import Home from '@src/pages/Home';
import Contacts from '@src/pages/Contacts';
import Discover from '@src/pages/Discover';
import Me from '@src/pages/Me';
import Chat from '@src/pages/Chat';
import ChatRoom from '@src/pages/Chat/ChatRoom';
import { userStorage } from '@src/utils/storage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        userStorage.isLoggedIn()
          ? <Navigate to="/home" replace /> 
          : <Navigate to="/login" replace />
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/set-nickname" element={<SetNickname />} />
      <Route path="/home" element={<Home />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/me" element={<Me />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:id" element={<ChatRoom />} />
    </Routes>
  );
};

export default AppRoutes;