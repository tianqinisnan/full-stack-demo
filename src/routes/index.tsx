import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import VerificationPage from '../pages/VerificationPage';
import HomePage from '../pages/HomePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verification" element={<VerificationPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
};