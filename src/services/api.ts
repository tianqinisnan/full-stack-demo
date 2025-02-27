import Toast from '@src/components/Toast';
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
  messageId: number;
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

type NavigateFunction = (path: string) => void;

class ApiService {
  private baseURL: string;
  private navigateCallback?: NavigateFunction;

  constructor() {
    this.baseURL = env.api.baseURL;
  }

  setNavigate(navigate: NavigateFunction) {
    this.navigateCallback = navigate;
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

      if (data.code === 401) {
        Toast.show('未登录');
        this.navigateCallback?.('/login');
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
  async updateNickname(nickname: string): Promise<ApiResponse> {
    return this.request('/api/users/update-nickname', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
  }

  // 更新头像
  async updateAvatar(avatarUrl: string): Promise<ApiResponse> {
    return this.request('/api/users/update-avatar', {
      method: 'POST',
      body: JSON.stringify({ avatarUrl }),
    });
  }

  // 获取用户信息
  async getUserInfo(phone?: string): Promise<ApiResponse<{ nickname: string, avatarUrl: string }>> {
    return this.request(`/api/users/info?phone=${encodeURIComponent(phone || '')}`, {
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

  // 上传图片
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${this.baseURL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '上传失败');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('上传失败');
    }
  }
}

export const apiService = new ApiService(); 