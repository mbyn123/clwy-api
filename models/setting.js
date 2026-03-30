'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '网站名称必须填写。' },
        notEmpty: { msg: '网站名称不能为空。' },
        len: { args: [2, 45], msg: '网站名称长度必须在 2 ~ 45 之间。' }
      }
    },
    icp: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'ICP 备案号必须填写。' },
        notEmpty: { msg: 'ICP 备案号不能为空。' },
        len: { args: [2, 45], msg: 'ICP 备案号长度必须在 2 ~ 45 之间。' }
      }
    },
    copyright: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '版权信息必须填写。' },
        notEmpty: { msg: '版权信息不能为空。' },
        len: { args: [2, 255], msg: '版权信息长度必须在 2 ~ 255 之间。' }
      }
    }
  }, {
    sequelize,
    modelName: 'Setting',
  });
  return Setting;
};