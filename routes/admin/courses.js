const express = require('express');
const router = express.Router();
const { Course, Category, User, Chapter } = require('../../models');
const { Op } = require('sequelize');
const {
    NotFoundError,
    success,
    failure,
} = require('../../utils/response');

/**
 * 公共方法：关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        // attributes: { exclude: ['CategoryId', 'UserId'] },
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
}

/**
 * 公共方法：查询当前课程
 */
async function getCourse(req) {
    const { id } = req.params;
    const course = await Course.findByPk(id, getCondition());

    if (!course) {
        throw new NotFoundError(`ID: ${id}的课程未找到。`)
    }

    return course;
}

/**
 * 公共方法：白名单过滤
 * @param req
 */
function whitelist(req) {
    return {
        categoryId: req.body.categoryId,
        userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content,
    };
}

/**
 * 查询课程列表
 */
router.get('/', async function (req, res, next) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            ...getCondition(),
            order: [['createdAt', 'DESC']],
            offset,
            limit: pageSize,
            where: {}
        };

        // 模糊查询：名称
        if (query.name) {
            condition.where.name = {
                [Op.like]: `%${query.name}%`
            };
        }

        // 精确查询：分类 ID
        if (query.categoryId) {
            condition.where.categoryId = query.categoryId;
        }

        // 精确查询：用户 ID
        if (query.userId) {
            condition.where.userId = query.userId;
        }

        // 精确查询：是否推荐
        if (query.recommended !== undefined && query.recommended !== '') {
            condition.where.recommended = query.recommended === 'true';
        }

        // 精确查询：是否入门
        if (query.introductory !== undefined && query.introductory !== '') {
            condition.where.introductory = query.introductory === 'true';
        }

        const { count, rows } = await Course.findAndCountAll(condition);
        success(res, '获取课程列表成功', {
            courses: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            },
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
        const course = await getCourse(req);
        success(res, '查询课程成功。', { course });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 创建课程
 */
router.post('/', async function (req, res, next) {
    try {
        const course = await Course.create(whitelist(req));
        success(res, '创建课程成功。', { course }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新课程
 */
router.put('/:id', async function (req, res, next) {
    try {
        const course = await getCourse(req);
        await course.update(whitelist(req));
        success(res, '更新课程成功。', { course });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除课程
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const course = await getCourse(req);
        const count = await Chapter.count({ where: { courseId: req.params.id } });
        if (count > 0) {
            throw new Error('当前课程有章节，无法删除。');
        }
        await course.destroy();
        success(res, '删除课程成功。');
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
