import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface VerificationInputProps {
  length?: number;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
}

const blink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const InputBox = styled.div`
  width: 44px;
  height: 44px;
  border: 1px solid #dcdee0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  position: relative;
  
  &.active {
    border-color: #1989fa;
  }
`;

const Cursor = styled.div`
  width: 2px;
  height: 24px;
  background-color: #1989fa;
  position: absolute;
  animation: ${blink} 1s infinite;
  display: none;

  ${InputBox}.active & {
    display: block;
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
`;

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
    <InputContainer onClick={handleBoxClick}>
      <HiddenInput
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {Array.from({ length }).map((_, index) => (
        <InputBox
          key={index}
          className={focused && index === value.length ? 'active' : ''}
        >
          {value[index] || ''}
          <Cursor />
        </InputBox>
      ))}
    </InputContainer>
  );
}; 