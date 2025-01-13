import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@src/pages/Login';
import Verification from '@src/pages/Verification';
import Home from '@src/pages/Home';
import SetNickname from '@src/pages/SetNickname';
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
    </Routes>
  );
};

export default AppRoutes;