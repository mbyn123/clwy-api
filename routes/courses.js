const express = require('express');
const router = express.Router();
const { Course, Category, Chapter, User } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询课程列表
 * GET /courses/:categoryId
 */
router.get('/', async function (req, res, next) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        if (!query.categoryId) {
            throw new Error('获取课程列表失败，分类ID不能为空。');
        }

        const condition = {
            attributes: { exclude: ['UserId', 'content'] },
            where: { categoryId: query.categoryId },
            order: [['createdAt', 'DESC']],
            offset,
            limit: pageSize,
        };
        const { rows, count } = await Course.findAndCountAll(condition);
        success(res, '获取课程列表成功。', {
            courses: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }
        });

    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询课程详情
 */
router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const condition = {
            attributes: { exclude: [] },
            where: { id },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Chapter,
                    as: 'chapters',
                    attributes: ['id', 'title', 'rank', 'createdAt'],
                    order: [['rank', 'ASC'], ['id', 'DESC']]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'nickname', 'avatar', 'company']
                }
            ]
        }
        const course = await Course.findByPk(id, condition);
        if (!course) {
            throw new Error('获取课程失败，课程不存在。');
        }
        success(res, '获取课程成功。', { course });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
