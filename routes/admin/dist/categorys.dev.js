"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    Category = _require.Category,
    Course = _require.Course;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var _require3 = require('../../utils/responses'),
    success = _require3.success,
    failure = _require3.failure;

var _require4 = require('../../utils/errors'),
    NotFoundError = _require4.NotFoundError;
/**
 * 公共方法：查询当前分类
 */


function getCategory(req) {
  var id, category;
  return regeneratorRuntime.async(function getCategory$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 获取分类 ID
          id = req.params.id; // 查询当前分类

          _context.next = 3;
          return regeneratorRuntime.awrap(Category.findByPk(id));

        case 3:
          category = _context.sent;

          if (category) {
            _context.next = 6;
            break;
          }

          throw new NotFoundError("ID: ".concat(id, "\u7684\u5206\u7C7B\u672A\u627E\u5230\u3002"));

        case 6:
          return _context.abrupt("return", category);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}
/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, rank}}
 */


function whitelist(req) {
  var _req$body = req.body,
      name = _req$body.name,
      rank = _req$body.rank;
  return {
    name: name,
    rank: rank
  };
}
/* 查询分类列表 */


router.get('/', function _callee(req, res, next) {
  var query, currentPage, pageSize, offset, condition, name, _ref, count, rows;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // 获取查询参数
          query = req.query;
          /** 分页查询 */

          currentPage = Math.abs(Number(query.currentPage)) || 1;
          pageSize = Math.abs(Number(query.pageSize)) || 10; // 计算offset

          offset = (currentPage - 1) * pageSize; // 排序：rank 升序，createdAt 倒序

          condition = {
            // include: [
            //     {
            //         model: Course,
            //         as: 'courses',
            //     }
            // ],
            order: [['rank', 'ASC'], ['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize
          };
          /** 模糊查询：按名称搜索 */

          name = req.query.name;

          if (name) {
            condition.where = {
              name: _defineProperty({}, Op.like, "%".concat(name, "%"))
            };
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(Category.findAndCountAll(condition));

        case 10:
          _ref = _context2.sent;
          count = _ref.count;
          rows = _ref.rows;
          success(res, '获取分类列表成功', {
            categories: rows,
            pagination: {
              total: count,
              currentPage: currentPage,
              pageSize: pageSize
            }
          });
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          failure(res, _context2.t0);

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
/* 查询所有分类（不分页，通常用于下拉框） */

router.get('/all', function _callee2(req, res, next) {
  var categories;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Category.findAll({
            order: [['rank', 'ASC'], ['createdAt', 'DESC']]
          }));

        case 3:
          categories = _context3.sent;
          success(res, '查询所有分类成功。', {
            categories: categories
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          failure(res, _context3.t0);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
/* 查询分类详情 */

router.get('/:id', function _callee3(req, res, next) {
  var category;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(getCategory(req));

        case 3:
          category = _context4.sent;
          success(res, '查询分类成功。', {
            category: category
          });
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          failure(res, _context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
/* 创建分类 */

router.post('/', function _callee4(req, res, next) {
  var category;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Category.create(whitelist(req)));

        case 3:
          category = _context5.sent;
          success(res, '创建分类成功。', {
            category: category
          }, 201);
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          failure(res, _context5.t0);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
/* 删除分类 */

router["delete"]('/:id', function _callee5(req, res, next) {
  var category, count;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(getCategory(req));

        case 3:
          category = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Course.count({
            where: {
              categoryId: req.params.id
            }
          }));

        case 6:
          count = _context6.sent;

          if (!(count > 0)) {
            _context6.next = 9;
            break;
          }

          throw new Error('当前分类有课程，无法删除。');

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(category.destroy());

        case 11:
          success(res, '删除分类成功。');
          _context6.next = 17;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          failure(res, _context6.t0);

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
/* 更新分类 */

router.put('/:id', function _callee6(req, res, next) {
  var category;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(getCategory(req));

        case 3:
          category = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(category.update(whitelist(req)));

        case 6:
          success(res, '更新分类成功。', {
            category: category
          });
          _context7.next = 12;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          failure(res, _context7.t0);

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;