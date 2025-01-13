import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.css';

interface VerificationInputProps {
  length?: number;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
}

export const VerificationInput: React.FC<VerificationInputProps> = ({
  length = 6,
  onChange,
  onComplete,
  autoFocus = true,
}) => {
  const [value, setValue] = useState<string>('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, length);
    setValue(newValue);
    onChange?.(newValue);

    if (newValue.length === length) {
      onComplete?.(newValue);
    }
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleBoxClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.inputContainer} onClick={handleBoxClick}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={styles.hiddenInput}
      />
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className={`${styles.inputBox} ${focused && index === value.length ? styles.active : ''}`}
        >
          {value[index] || ''}
          <div className={styles.cursor} />
        </div>
      ))}
    </div>
  );
}; 