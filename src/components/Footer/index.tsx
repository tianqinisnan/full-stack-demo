import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './style.module.css';

// 使用 iconfont 图标
const tabs = [
  { 
    path: '/home', 
    icon: {
      active: 'icon-a-shapehomepressedtrue',
      inactive: 'icon-a-shapehomepressedfalse'
    }, 
    label: '首页' 
  },
  { 
    path: '/contacts', 
    icon: {
      active: 'icon-a-shapephonepressedtrue',
      inactive: 'icon-a-shapephonepressedfalse'
    }, 
    label: '通讯录' 
  },
  { 
    path: '/discover', 
    icon: {
      active: 'icon-a-shapeexplorepressedtrue',
      inactive: 'icon-a-shapeexplorepressedfalse'
    }, 
    label: '发现' 
  },
  { 
    path: '/me', 
    icon: {
      active: 'icon-a-shapeaccountpressedtrue',
      inactive: 'icon-a-shapeaccountpressedfalse'
    }, 
    label: '我的' 
  },
];

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div className={styles.tabBar}>
      {tabs.map(tab => {
        const isActive = currentPath === tab.path;
        const iconName = isActive ? tab.icon.active : tab.icon.inactive;
        return (
          <div
            key={tab.path}
            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref={`#${iconName}`} />
            </svg>
            <div className={styles.label}>{tab.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Footer; 