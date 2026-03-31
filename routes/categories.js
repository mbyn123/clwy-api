const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { success, failure } = require('../utils/responses');



router.get('/', async function (req, res, next) {
    try {
        const categories = await Category.findAll({
            order: [['rank', 'asc'], ['id', 'desc']]
        });
        success(res, '获取分类列表成功。', { categories });

    } catch (error) {
        failure(res, error);
    }
});


module.exports = router;