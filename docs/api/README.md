# API 文档

## 用户认证相关接口

### 发送验证码
- **URL**: `/api/auth/send-code`
- **Method**: `POST`
- **请求参数**:
  ```typescript
  {
    phone: string;  // 手机号
  }
  ```
- **响应数据**:
  ```typescript
  {
    success: boolean;  // 是否成功
    message?: string;  // 错误信息（如果有）
  }
  ```

### 验证码验证
- **URL**: `/api/auth/verify-code`
- **Method**: `POST`
- **请求参数**:
  ```typescript
  {
    phone: string;    // 手机号
    code: string;     // 验证码
  }
  ```
- **响应数据**:
  ```typescript
  {
    success: boolean;     // 是否成功
    message?: string;     // 错误信息（如果有）
    data?: {
      isNewUser: boolean; // 是否新用户
      nickname?: string;  // 如果是老用户，返回昵称
    }
  }
  ```

## 用户信息相关接口

### 更新用户昵称
- **URL**: `/api/user/update-nickname`
- **Method**: `POST`
- **请求参数**:
  ```typescript
  {
    phone: string;    // 手机号
    nickname: string; // 新昵称
  }
  ```
- **响应数据**:
  ```typescript
  {
    success: boolean;  // 是否成功
    message?: string;  // 错误信息（如果有）
  }
  ```

### 获取用户信息
- **URL**: `/api/user/info`
- **Method**: `GET`
- **查询参数**:
  ```typescript
  phone: string;  // 手机号
  ```
- **响应数据**:
  ```typescript
  {
    success: boolean;     // 是否成功
    message?: string;     // 错误信息（如果有）
    data?: {
      phone: string;      // 手机号
      nickname: string;   // 昵称
    }
  }
  ``` 