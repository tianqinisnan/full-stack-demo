import { env } from '@src/config/env';

export const getFullUrl = (url: string): string => {
  // 如果是完整的 URL（以 http:// 或 https:// 开头），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是以 / 开头的相对路径，拼接完整 URL
  if (url.startsWith('/')) {
    return `${env.assets.baseURL}${url}`;
  }
  
  // 其他情况，添加 / 后拼接
  return `${env.assets.baseURL}/${url}`;
}; 