// 存储键名常量
const STORAGE_KEYS = {
  USER_PHONE: 'userPhone',
} as const;

// 用户相关存储操作
export const userStorage = {
  // 保存用户手机号
  setPhone: (phone: string) => {
    localStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
  },

  // 获取用户手机号
  getPhone: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_PHONE);
  },

  // 检查用户是否已登录
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.USER_PHONE);
  },

  // 清除用户手机号
  clearPhone: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_PHONE);
  },

  // 清除所有用户相关数据
  clearAll: () => {
    localStorage.clear();
  }
}; 