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
    ]
   }
    