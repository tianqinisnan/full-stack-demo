import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NavigationProvider } from './contexts/NavigationContext';
import AppRoutes from './routes';
import '@src/styles/reset.css';
import '@src/styles/variables.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <AppRoutes />
      </NavigationProvider>
    </BrowserRouter>
  );
};

export default App;