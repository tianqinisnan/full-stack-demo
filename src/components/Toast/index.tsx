import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.css';

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 2000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast}>
        {message}
      </div>
    </div>
  );
};

// Toast 管理器
class ToastManager {
  private static container: HTMLDivElement | null = null;
  private static currentToast: number | null = null;

  private static createContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  static show(message: string, duration: number = 2000) {
    const container = this.createContainer();

    // 如果已经有 toast，先移除它
    if (this.currentToast !== null) {
      this.hide();
    }

    const toastRoot = document.createElement('div');
    container.appendChild(toastRoot);

    const handleClose = () => {
      if (toastRoot && toastRoot.parentNode === container) {
        ReactDOM.unmountComponentAtNode(toastRoot);
        container.removeChild(toastRoot);
      }
      this.currentToast = null;
    };

    ReactDOM.render(
      <Toast message={message} duration={duration} onClose={handleClose} />,
      toastRoot
    );

    this.currentToast = window.setTimeout(handleClose, duration);
  }

  static hide() {
    if (this.currentToast !== null) {
      clearTimeout(this.currentToast);
      this.currentToast = null;
    }

    if (this.container) {
      const toastElements = this.container.children;
      Array.from(toastElements).forEach(element => {
        if (element.parentNode === this.container) {
          ReactDOM.unmountComponentAtNode(element);
          this.container?.removeChild(element);
        }
      });
    }
  }
}

export default ToastManager; 