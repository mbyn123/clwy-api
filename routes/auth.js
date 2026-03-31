const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { success, failure } = require('../utils/responses');
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../utils/errors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');



/**
 * 注册
 */
router.post('/sign_up', async function (req, res) {
    try {
        const { username, password, nickname, email } = req.body;
        if (!username || !password || !nickname || !email) {
            throw new BadRequestError('用户名、密码、昵称、邮箱不能为空。')
        }
        const user = await User.create({
            username,
            password,
            nickname,
            email,
            role: 0,
            sex: 2,
        });
        delete user.dataValues.password;         // 删除密码

        success(res, '注册成功。', { user }, 201);
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 登录
 */
router.post('/sign_in', async function (req, res) {
    try {
        const { login, password } = req.body;
        if (!login) {
            throw new BadRequestError('邮箱/用户名必须填写。');
        }

        if (!password) {
            throw new BadRequestError('密码必须填写。');
        }

        const condition = {
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        };

        // 通过email或username，查询用户是否存在
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFoundError('用户不存在，无法登录。');
        }
        // 验证密码
        const isMatchValid = await bcrypt.compare(password, user.password);
        if (!isMatchValid) {
            throw new UnauthorizedError('密码错误。');
        }
        // 生成身份验证令牌
        const token = jwt.sign({
            userId: user.id
        }, process.env.SECRET, { expiresIn: '30d' }
        );
        success(res, '登录成功。', { token });
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;