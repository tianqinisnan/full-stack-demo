#!/bin/bash

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "开始安装项目依赖..."

# 检查 MongoDB 是否已安装
if ! command -v mongod &> /dev/null; then
    echo "错误: MongoDB 未安装"
    echo "请先安装 MongoDB："
    echo "MacOS: brew install mongodb-community"
    echo "Ubuntu: sudo apt install mongodb"
    echo "Windows: 请访问 https://www.mongodb.com/try/download/community"
    exit 1
fi

# 创建必要的目录
echo "创建必要的目录..."
mkdir -p "$PROJECT_ROOT/mongodb/data/db"
mkdir -p "$PROJECT_ROOT/mongodb/log"

# 设置目录权限
echo "设置目录权限..."
chmod -R 755 "$PROJECT_ROOT/mongodb"
chmod +x "$PROJECT_ROOT/mongodb/scripts/manage-db.sh"

# 安装服务器依赖
echo "安装服务器依赖..."
cd "$PROJECT_ROOT/server" && npm install

# 安装前端依赖
echo "安装前端依赖..."
cd "$PROJECT_ROOT" && npm install

echo "项目安装完成！"
echo "你可以通过以下命令启动项目："
echo "1. 启动数据库和服务器："
echo "   cd server && npm run dev:with-db"
echo "2. 启动前端开发服务器："
echo "   npm start" 