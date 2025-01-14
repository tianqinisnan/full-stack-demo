import { pinyin } from 'pinyin-pro';

/**
 * 将中文字符串转换为拼音首字母
 * @param str 要转换的字符串
 * @returns 转换后的拼音首字母（大写）
 */
export const getFirstPinyin = (str: string): string => {
  if (!str) return '#';
  
  // 如果是英文或数字，直接返回首字母
  const first = str.charAt(0);
  if (/[a-zA-Z0-9]/.test(first)) {
    return first.toUpperCase();
  }

  // 获取首字的拼音首字母
  const pinyinResult = pinyin(first, { pattern: 'first', toneType: 'none' });
  console.log('pinyinResult', pinyinResult);
  if (pinyinResult) {
    return pinyinResult.toUpperCase();
  }

  // 如果无法转换为拼音，返回 #
  return '#';
};

/**
 * 获取完整的拼音（用于排序）
 * @param str 要转换的字符串
 * @returns 完整的拼音字符串
 */
export const getFullPinyin = (str: string): string => {
  if (!str) return '';

  // 如果是英文或数字，直接返回小写形式
  if (/^[a-zA-Z0-9]+$/.test(str)) {
    return str.toLowerCase();
  }

  // 获取完整拼音，不带声调
  return pinyin(str, { toneType: 'none', type: 'string' });
}; 