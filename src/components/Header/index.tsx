import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

interface HeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  rightContent,
  onBack 
}) => {
  const navigate = useNavigate();

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
        <div className={styles.backButton} onClick={handleBack}>
          <svg className={styles.icon} aria-hidden="true">
            <use xlinkHref="#icon-mti-jiantouzuo" />
          </svg>
        </div>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.right}>
        {rightContent}
      </div>
    </header>
  );
};

export default Header; 