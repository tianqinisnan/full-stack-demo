// 手机号验证正则表达式
export const PHONE_REGEX = /^1[3-9]\d{9}$/;

// 验证手机号
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

// 验证码验证
export const isValidVerificationCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
}; 