const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const { Op } = require('sequelize');
const {
    NotFoundError,
    success,
    failure,
} = require('../../utils/response');

/**
 * 公共方法：查询当前文章
 */
async function getArticle(req) {
    // 获取文章 ID
    const { id } = req.params;

    // 查询当前文章
    const article = await Article.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!article) {
        throw new NotFoundError(`ID: ${id}的文章未找到。`)
    }

    return article;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{title, content}}
 */
function whitelist(req) {
    const { title, content } = req.body;
    return {
        title,
        content,
    };
}



/* 查询文章列表 */
router.get('/', async function (req, res, next) {
    try {
        // 获取查询参数
        const query = req.query;
        /** 分页查询 */
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;

        // 计算offset
        const offset = (currentPage - 1) * pageSize;
        // 创建时间倒序排序
        const condition = {
            order: [['createdAt', 'DESC']],
            offset,
            limit: pageSize,
        };
        /** 模糊查询 */
        const { title } = req.query;
        if (title) {
            condition.where = {
                title: {
                    [Op.like]: `%${title}%`,
                },
            };
        }


        // const articles = await Article.findAll(condition);
        const { count, rows } = await Article.findAndCountAll(condition);
        success(res, '获取文章列表成功', {
            articles: rows,
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

/* 查询文章详情 */
router.get('/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req);
        success(res, '查询文章成功。', { article });

    } catch (error) {
        failure(res, error);

    }
});

/* 创建文章 */
router.post('/', async function (req, res, next) {
    try {
        const article = await Article.create(whitelist(req));
        success(res, '创建文章成功。', { article }, 201);

    } catch (error) {
        failure(res, error);
    }
});

/* 删除文章 */
router.delete('/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req);
        await article.destroy();
        success(res, '删除文章成功。');

    } catch (error) {
        failure(res, error);

    }
});

/* 更新文章 */
router.put('/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req);
        await article.update(whitelist(req));
        success(res, '更新文章成功。', { article });

    } catch (error) {
        failure(res, error);

    }
});



module.exports = router;
