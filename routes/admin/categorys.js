const express = require('express');
const router = express.Router();
const { Category, Course } = require('../../models');
const { Op } = require('sequelize');
const {
    NotFoundError,
    success,
    failure,
} = require('../../utils/response');

/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
    // 获取分类 ID
    const { id } = req.params;

    // 查询当前分类
    const category = await Category.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!category) {
        throw new NotFoundError(`ID: ${id}的分类未找到。`)
    }

    return category;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, rank}}
 */
function whitelist(req) {
    const { name, rank } = req.body;
    return {
        name,
        rank,
    };
}

/* 查询分类列表 */
router.get('/', async function (req, res, next) {
    try {
        // 获取查询参数
        const query = req.query;
        /** 分页查询 */
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;

        // 计算offset
        const offset = (currentPage - 1) * pageSize;
        // 排序：rank 升序，createdAt 倒序
        const condition = {
            // include: [
            //     {
            //         model: Course,
            //         as: 'courses',
            //     }
            // ],
            order: [['rank', 'ASC'], ['createdAt', 'DESC']],
            offset,
            limit: pageSize,
        };
        /** 模糊查询：按名称搜索 */
        const { name } = req.query;
        if (name) {
            condition.where = {
                name: {
                    [Op.like]: `%${name}%`,
                },
            };
        }

        const { count, rows } = await Category.findAndCountAll(condition);
        success(res, '获取分类列表成功', {
            categories: rows,
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

/* 查询所有分类（不分页，通常用于下拉框） */
router.get('/all', async function (req, res, next) {
    try {
        const categories = await Category.findAll({
            order: [['rank', 'ASC'], ['createdAt', 'DESC']],
        });
        success(res, '查询所有分类成功。', { categories });
    } catch (error) {
        failure(res, error);
    }
});

/* 查询分类详情 */
router.get('/:id', async function (req, res, next) {
    try {
        const category = await getCategory(req);
        success(res, '查询分类成功。', { category });

    } catch (error) {
        failure(res, error);
    }
});

/* 创建分类 */
router.post('/', async function (req, res, next) {
    try {
        const category = await Category.create(whitelist(req));
        success(res, '创建分类成功。', { category }, 201);

    } catch (error) {
        failure(res, error);
    }
});

/* 删除分类 */
router.delete('/:id', async function (req, res, next) {
    try {
        const category = await getCategory(req);
        const count = await Course.count({ where: { categoryId: req.params.id } });
        if (count > 0) {
            throw new Error('当前分类有课程，无法删除。');
        }
        await category.destroy();
        success(res, '删除分类成功。');

    } catch (error) {
        failure(res, error);
    }
});

/* 更新分类 */
router.put('/:id', async function (req, res, next) {
    try {
        const category = await getCategory(req);
        await category.update(whitelist(req));
        success(res, '更新分类成功。', { category });

    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
