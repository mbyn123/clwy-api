<!-- 1.生成设置模型和迁移文件 -->
sequelize model:generate --name Setting --attributes name:string,icp:string,copyright:string

这一步会自动生成两个文件： models/xxx.js （给 Node.js 用）和 migrations/xxx.js （给数据库用）

<!-- 修改迁移模型 -->
sequelize migration:create --name update-setting-fields

<!-- 2.运行迁移，生成数据表 -->
sequelize db:migrate  

它会读取 migrations 文件夹中所有“尚未运行”的文件，并在数据库中真正创建或修改表结构。

<!-- 3.生成分类种子文件 -->
sequelize seed:generate --name category

当表结构准备好后，你可能需要一些初始数据（如默认管理员、系统配置、分类列表）。这一步会生成一个模板文件，你可以在其中填充数据。

<!-- 4.运行种子文件，将数据填充到数据表中 -->
sequelize db:seed --seed 20260328054706-artice

<!-- 回滚最近一次执行的 seed -->
sequelize db:seed:undo

<!-- 回滚所有的 seed -->
sequelize db:seed:undo:all


<!-- 关联表查询 -->

1. models目录下，每个模型都有一个关联方法，用于关联其他模型。

关联方法associate

 static associate(models) {
      // 关联分类表
      Course.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      // 关联用户表
      Course.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }


2. 在路由中，使用关联方法查询关联表数据。

例如：
查询课程表时，关联查询分类表和用户表。

在 condition 中添加 include 选项，

const { Course, Category, User } = require('../../models');


 condition = {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }
    
---

## **项目部署流程 (Docker)**

本项目支持使用 Docker 进行一键部署，确保开发环境与生产环境完全一致。

### **1. 准备工作**
在服务器上需要安装以下工具：
- **Git**: 用于拉取代码
- **Docker**: 容器引擎
- **Docker Compose**: 容器编排工具

### **2. 服务器环境配置 (以阿里云为例)**

#### **安装 Git & Docker**
```bash
# 安装 Git
sudo yum install git -y

# 安装 Docker (阿里云镜像)
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
sudo systemctl start docker
sudo systemctl enable docker
```

#### **安装 Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### **配置虚拟内存 (Swap) - 1GB 内存服务器必做**
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### **3. 部署步骤**

1. **拉取代码**：
   ```bash
   git clone <你的仓库地址>
   cd clwy-api
   ```

2. **启动项目**：
   ```bash
   # 构建镜像并启动容器
   sudo /usr/local/bin/docker-compose up -d --build
   ```

3. **初始化数据库 (执行迁移和种子数据)**：
   ```bash
   # 执行数据库迁移
   sudo /usr/local/bin/docker-compose exec app npx sequelize-cli db:migrate

   # (可选) 填充初始数据
   sudo /usr/local/bin/docker-compose exec app npx sequelize-cli db:seed:all
   ```

### **4. 常用维护命令**

- **查看实时日志**：`sudo /usr/local/bin/docker-compose logs -f app`
- **重启服务**：`sudo /usr/local/bin/docker-compose restart`
- **停止并删除容器**：`sudo /usr/local/bin/docker-compose down`
- **更新代码后重新部署**：
  ```bash
  git pull
  sudo /usr/local/bin/docker-compose up -d --build
  ```

### **5. 注意事项**
- **端口开放**：请确保在阿里云控制台防火墙中开放 **3000** 端口。
- **数据库连接**：Docker 内部使用 `DB_HOST=mysql` 进行通信，无需修改 `config.js`。
]
   }
    