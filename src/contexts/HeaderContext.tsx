import React, { createContext, useContext, useState, ReactNode, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderConfig {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: ReactNode;
}

// 默认配置
const defaultConfig: HeaderConfig = {
  title: '',
  showBack: false,
  rightContent: null
};

interface HeaderContextType {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  config: defaultConfig,
  setConfig: () => {},
});

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig);

  useLayoutEffect(() => {
    setConfig(defaultConfig);
  }, [location.pathname]);

  return (
    <HeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}; 