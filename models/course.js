'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
moment.locale('zh-cn');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 关联分类表 谁有关联的字段，谁就是belongsTo
      models.Course.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      // 关联用户表 
      models.Course.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      // 关联章节表 反过来，每个课程都有很多章节，所以在课程模型里，要加上hasMany
      models.Course.hasMany(models.Chapter, { foreignKey: 'courseId', as: 'chapters' });
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '分类ID必须填写。' },
        notEmpty: { msg: '分类ID不能为空。' },
        async isPresent(value) {
          const category = await sequelize.models.Category.findByPk(value)
          if (!category) {
            throw new Error(`ID为：${value} 的分类不存在。`);
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '用户ID必须填写。' },
        notEmpty: { msg: '用户ID不能为空。' },
        async isPresent(value) {
          const user = await sequelize.models.User.findByPk(value)
          if (!user) {
            throw new Error(`ID为：${value} 的用户不存在。`);
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '名称必须填写。' },
        notEmpty: { msg: '名称不能为空。' },
        len: { args: [2, 45], msg: '名称长度必须是2 ~ 45之间。' }
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrlOrEmpty(value) {
          if (value && value.length > 0 && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
            throw new Error('图片地址不正确。');
          }
        }
      }
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: { args: [[true, false]], msg: '是否推荐的值必须是，推荐：true 不推荐：false。' }
      }
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: { args: [[true, false]], msg: '是否入门课程的值必须是，推荐：true 不推荐：false。' }
      }
    },
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },

  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};