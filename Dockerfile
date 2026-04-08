# 使用官方 Node.js 镜像作为基础镜像
FROM node:22.11.0

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有项目文件到容器中
COPY . .

# 暴露应用运行的端口
EXPOSE 3000

# 启动命令
CMD ["npm", "run", "docker:start"]
