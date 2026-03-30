'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '标题必须存在。'
        },
        notEmpty: {
          msg: '标题不能为空。'
        },


        len: {
          args: [1, 255],
          msg: '文章标题长度必须在1到255个字符之间',
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '内容必须存在。'
        },
        notEmpty:{
           msg: '内容不能为空。'
        },

        len: {
          args: [1, 65535],
          msg: '文章内容长度必须在1到65535个字符之间',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};