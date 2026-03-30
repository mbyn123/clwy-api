const express = require('express');
const router = express.Router();
const { Setting } = require('../../models');
const {
    NotFoundError,
    success,
    failure,
} = require('../../utils/response');

/**
 * 公共方法：查询系统设置
 */
async function getSetting() {
    // 系统设置通常只有一条记录，查询第一条
    const setting = await Setting.findOne();

    // 如果没有找到，就抛出异常
    if (!setting) {
        throw new NotFoundError('系统设置未找到。')
    }

    return setting;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, icp, copyright}}
 */
function whitelist(req) {
    const { name, icp, copyright } = req.body;
    return {
        name,
        icp,
        copyright,
    };
}

/* 查询系统设置 */
router.get('/', async function (req, res, next) {
    try {
        const setting = await getSetting();
        success(res, '查询系统设置成功。', { setting });

    } catch (error) {
        failure(res, error);
    }
});

/* 更新系统设置 */
router.put('/', async function (req, res, next) {
    try {
        const setting = await getSetting();
        await setting.update(whitelist(req));
        success(res, '更新系统设置成功。', { setting });

    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
