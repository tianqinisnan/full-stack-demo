#!/bin/bash

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

# 尝试从不同位置加载环境变量
load_env() {
  # 首先尝试加载项目根目录的 .env
  if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
  fi
  
  # 如果环境变量还是没有设置，尝试从 package.json 中获取
  if [ -z "$MONGODB_HOST" ] || [ -z "$MONGODB_PORT" ]; then
    if [ -f "$PROJECT_ROOT/server/package.json" ]; then
      MONGODB_HOST=$(node -e "console.log(require('./server/package.json').config?.mongodb?.host || '127.0.0.1')")
      MONGODB_PORT=$(node -e "console.log(require('./server/package.json').config?.mongodb?.port || '27017')")
    fi
  fi
  
  # 最后设置默认值
  MONGODB_HOST=${MONGODB_HOST:-127.0.0.1}
  MONGODB_PORT=${MONGODB_PORT:-27017}
  
  echo "MongoDB 将使用以下配置:"
  echo "主机: $MONGODB_HOST"
  echo "端口: $MONGODB_PORT"
}

# 确保必要的目录存在
ensure_directories() {
  mkdir -p "$PROJECT_ROOT/mongodb/data/db"
  mkdir -p "$PROJECT_ROOT/mongodb/log"
  
  # 确保目录权限正确
  chmod 777 "$PROJECT_ROOT/mongodb/data/db"
  chmod 777 "$PROJECT_ROOT/mongodb/log"
  
  # 确保日志文件存在并可写
  touch "$PROJECT_ROOT/mongodb/log/mongod.log"
  chmod 666 "$PROJECT_ROOT/mongodb/log/mongod.log"
}

case "$1" in
  "start")
    echo "启动 MongoDB..."
    load_env
    ensure_directories
    
    # 检查是否已经在运行
    if pgrep mongod > /dev/null; then
      echo "MongoDB 已经在运行中"
      exit 0
    fi
    
    # 切换到 server 目录运行 MongoDB
    cd "$PROJECT_ROOT/server"
    
    # 在后台运行 MongoDB
    mongod --config "$PROJECT_ROOT/mongodb/config/mongod.conf" \
      --bind_ip "$MONGODB_HOST" \
      --port "$MONGODB_PORT" \
      --fork
    
    echo "MongoDB 已启动"
    ;;
  "stop")
    echo "停止 MongoDB..."
    pkill mongod
    echo "MongoDB 已停止"
    ;;
  "status")
    load_env
    if pgrep mongod > /dev/null
    then
      echo "MongoDB 正在运行"
      echo "可以使用 MongoDB Compass 连接: mongodb://$MONGODB_HOST:$MONGODB_PORT"
    else
      echo "MongoDB 未运行"
    fi
    ;;
  "clean")
    echo "清理数据..."
    rm -rf "$PROJECT_ROOT/mongodb/data/db"/*
    rm -f "$PROJECT_ROOT/mongodb/log"/*
    mkdir -p "$PROJECT_ROOT/mongodb/data/db"
    echo "数据已清理完成"
    ;;
  *)
    echo "使用方法: $0 {start|stop|status|clean}"
    echo "  start  : 启动 MongoDB 服务"
    echo "  stop   : 停止 MongoDB 服务"
    echo "  status : 查看服务状态"
    echo "  clean  : 清理数据（谨慎使用）"
    exit 1
    ;;
esac 