const express = require('express');
const router = express.Router();
const { Chapter, Course } = require('../../models');
const { Op } = require('sequelize');
const {
    success,
    failure,
} = require('../../utils/responses');
const {
    NotFoundError,
} = require('../../utils/errors');

/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    // attributes: { exclude: ['CourseId'] },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'name']
      }
    ]
  }
}


/**
 * 公共方法：查询当前章节
 */
async function getChapter(req) {
    const { id } = req.params;
    const chapter = await Chapter.findByPk(id, getCondition());

    if (!chapter) {
        throw new NotFoundError(`ID: ${id}的章节未找到。`)
    }

    return chapter;
}

/**
 * 公共方法：白名单过滤
 * @param req
 */
function whitelist(req) {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank,
    };
}

/**
 * 查询章节列表
 * 必须传入 courseId
 */
router.get('/', async function (req, res, next) {
    try {
        const query = req.query;
        const { courseId, title } = query;

        if (!courseId) {
            throw new Error('查询章节列表必须传入课程 ID (courseId)。');
        }

        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            where: { courseId },
            order: [['rank', 'ASC'], ['createdAt', 'DESC']],
            offset,
            limit: pageSize,
        };

        if (title) {
            condition.where.title = {
                [Op.like]: `%${title}%`
            };
        }

        const { count, rows } = await Chapter.findAndCountAll(condition);
        success(res, '获取章节列表成功', {
            chapters: rows,
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
 * 查询章节详情
 */
router.get('/:id', async function (req, res, next) {
    try {
        const chapter = await getChapter(req);
        success(res, '查询章节成功。', { chapter });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 创建章节
 */
router.post('/', async function (req, res, next) {
    try {
        const chapter = await Chapter.create(whitelist(req));
        success(res, '创建章节成功。', { chapter }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新章节
 */
router.put('/:id', async function (req, res, next) {
    try {
        const chapter = await getChapter(req);
        await chapter.update(whitelist(req));
        success(res, '更新章节成功。', { chapter });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除章节
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const chapter = await getChapter(req);
        await chapter.destroy();
        success(res, '删除章节成功。');
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
