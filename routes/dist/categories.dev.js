"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    Category = _require.Category;

var _require2 = require('../utils/responses'),
    success = _require2.success,
    failure = _require2.failure;

router.get('/', function _callee(req, res, next) {
  var categories;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Category.findAll({
            order: [['rank', 'asc'], ['id', 'desc']]
          }));

        case 3:
          categories = _context.sent;
          success(res, '获取分类列表成功。', {
            categories: categories
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          failure(res, _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;