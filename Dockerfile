# 第一阶段：构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 接收构建参数
ARG VITE_API_BASE_URL
ARG VITE_IDLE_TIMEOUT_MINUTES=30

# 将构建参数设置为环境变量
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_IDLE_TIMEOUT_MINUTES=${VITE_IDLE_TIMEOUT_MINUTES}

# 配置 npm 使用淘宝镜像源（适配中国网络环境）
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# 复制源代码（quasar prepare 需要项目配置文件）
COPY . .

# 安装依赖（使用 npm install 而不是 ci，更容错）
RUN npm install --production=false --no-audit --prefer-offline || \
    npm install --production=false --no-audit

# 构建应用
RUN npm run build

# 第二阶段：运行阶段
FROM nginx:alpine

# 从构建阶段复制构建产物
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 3000

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

