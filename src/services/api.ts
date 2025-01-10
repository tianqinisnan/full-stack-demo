import { env } from '../config/env';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = env.api.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '请求失败');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('请求失败');
    }
  }

  // 发送验证码
  async sendVerificationCode(phone: string): Promise<ApiResponse> {
    return this.request('/api/verification/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  // 验证验证码
  async verifyCode(phone: string, code: string): Promise<ApiResponse> {
    return this.request('/api/verification/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }
}

export const apiService = new ApiService(); 