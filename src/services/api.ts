import { env } from '../config/env';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserInfo {
  phone: string;
  nickname: string;
  avatarUrl?: string;
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
  async verifyCode(phone: string, code: string): Promise<ApiResponse<{ isNewUser: boolean; nickname?: string }>> {
    return this.request('/api/verification/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  // 更新昵称
  async updateNickname(phone: string, nickname: string): Promise<ApiResponse> {
    return this.request('/api/users/update-nickname', {
      method: 'POST',
      body: JSON.stringify({ phone, nickname }),
    });
  }

  // 获取用户信息
  async getUserInfo(phone: string): Promise<ApiResponse<{ nickname: string }>> {
    return this.request(`/api/users/info?phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
    });
  }

  // 获取全部用户信息
  async getAllUsers(): Promise<ApiResponse<UserInfo[]>> {
    return this.request('/api/users/all', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService(); 