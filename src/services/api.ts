import { env } from '../config/env';
import { userStorage } from '@src/utils/storage';

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

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image';
  status: 'sending' | 'sent' | 'read' | 'failed';
  createdAt: string;
}

export interface Conversation {
  userId: string;
  nickname: string;
  avatarUrl?: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
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
      const phone = userStorage.getPhone();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-phone': phone || '',
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

  // 获取会话列表
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.request('/api/chat/conversations', {
      method: 'GET',
    });
  }

  // 获取与指定用户的聊天记录
  async getMessages(userId: string, before?: string): Promise<ApiResponse<Message[]>> {
    const url = before
      ? `/api/chat/messages/${userId}?before=${before}`
      : `/api/chat/messages/${userId}`;
    return this.request(url, {
      method: 'GET',
    });
  }

  // 发送消息
  async sendMessage(receiverId: string, content: string, type: 'text' | 'image' = 'text'): Promise<ApiResponse<Message>> {
    return this.request('/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content, type }),
    });
  }

  // 标记消息为已读
  async markMessageAsRead(messageId: string): Promise<ApiResponse> {
    return this.request(`/api/chat/messages/${messageId}/read`, {
      method: 'POST',
    });
  }

  // 创建或获取会话
  async createOrGetConversation(partnerId: string): Promise<ApiResponse<Conversation>> {
    return this.request(`/api/chat/conversations`, {
      method: 'POST',
      body: JSON.stringify({ partnerId }),
    });
  }
}

export const apiService = new ApiService(); 