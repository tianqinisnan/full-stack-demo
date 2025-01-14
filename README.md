# 验证系统 Demo

这是一个使用 React + Node.js + MongoDB 构建的验证系统示例项目。

## 功能特性

- 手机号验证码登录
- 用户行为埋点分析
- RESTful API
- MongoDB 数据存储

## 技术栈

### 前端
- React
- TypeScript
- Ant Design
- Axios

### 后端
- Node.js
- Express
- TypeScript
- MongoDB

## 项目设置

### 前置要求

- Node.js (v14+)
- Yarn/npm
- MongoDB (v4+)

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd [项目目录]
```

2. 运行安装脚本
```bash
chmod +x scripts/setup.sh  # 添加执行权限
./scripts/setup.sh
```

安装脚本会：
- 检查 MongoDB 是否已安装
- 创建必要的 MongoDB 目录和日志文件
- 设置正确的目录权限
- 安装前端和后端依赖

3. 配置环境变量
```bash
cp .env.example .env  # 如果还没有.env文件
```
- 检查并根据需要修改 `.env` 文件中的配置

### 启动项目

1. 启动数据库和后端服务
```bash
cd server
npm run dev:with-db
```

2. 启动前端应用（新开一个终端）
```bash
npm start
```

## 项目结构

```
.
├── src/                # 前端源代码
├── server/            # 后端源代码
├── mongodb/           # MongoDB 相关文件
│   ├── data/         # 数据文件 (git已忽略)
│   └── log/          # 日志文件 (git已忽略)
├── scripts/          # 辅助脚本
└── public/           # 静态资源
```

## API 文档

### 验证接口

- POST `/api/verification/send-code` - 发送验证码
- POST `/api/verification/verify-code` - 验证验证码

### 埋点接口

- POST `/api/events/track` - 记录埋点事件
- GET `/api/events/list` - 获取埋点事件列表

## 开发说明

1. 本地开发时，MongoDB 数据存储在 `mongodb/data` 目录
2. 日志文件位于 `mongodb/log/mongodb.log`
3. 建议在生产环境中修改 MongoDB 的数据存储位置

## 注意事项

1. 确保 `.env` 文件中的配置正确
2. 不要提交 `mongodb/data` 和 `mongodb/log` 目录
3. 生产环境部署时注意修改相关配置

## 资源地址
- [iconfont](https://www.iconfont.cn/)
- [iconfont 图标库](https://at.alicdn.com/t/c/font_4810692_a2uulh7bvjq.js)

## License

MIT 