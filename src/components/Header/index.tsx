import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '@src/contexts/HeaderContext';
import styles from './style.module.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title: propTitle, showBack: propShowBack }) => {
  const navigate = useNavigate();
  const { config } = useHeader();
  const { title: configTitle, showBack: configShowBack = false, onBack, rightContent = null } = config;

  const displayTitle = configTitle || propTitle || '';
  const showBack = configShowBack || propShowBack || false;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBack && (
          <div className={styles.backButton} onClick={handleBack}>
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref="#icon-mti-jiantouzuo" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.title}>{displayTitle}</div>
      <div className={styles.right}>
        {rightContent}
      </div>
    </header>
  );
};

export default Header; 