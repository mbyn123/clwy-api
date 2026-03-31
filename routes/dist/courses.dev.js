"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    Course = _require.Course,
    Category = _require.Category,
    Chapter = _require.Chapter,
    User = _require.User;

var _require2 = require('../utils/responses'),
    success = _require2.success,
    failure = _require2.failure;
/**
 * 查询课程列表
 * GET /courses/:categoryId
 */


router.get('/', function _callee(req, res, next) {
  var query, currentPage, pageSize, offset, condition, _ref, rows, count;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          query = req.query;
          currentPage = Math.abs(Number(query.currentPage)) || 1;
          pageSize = Math.abs(Number(query.pageSize)) || 10;
          offset = (currentPage - 1) * pageSize;

          if (query.categoryId) {
            _context.next = 7;
            break;
          }

          throw new Error('获取课程列表失败，分类ID不能为空。');

        case 7:
          condition = {
            attributes: {
              exclude: ['UserId', 'content']
            },
            where: {
              categoryId: query.categoryId
            },
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize
          };
          _context.next = 10;
          return regeneratorRuntime.awrap(Course.findAndCountAll(condition));

        case 10:
          _ref = _context.sent;
          rows = _ref.rows;
          count = _ref.count;
          success(res, '获取课程列表成功。', {
            courses: rows,
            pagination: {
              total: count,
              currentPage: currentPage,
              pageSize: pageSize
            }
          });
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          failure(res, _context.t0);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
/**
 * 查询课程详情
 */

router.get('/:id', function _callee2(req, res, next) {
  var id, condition, course;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          condition = {
            attributes: {
              exclude: []
            },
            where: {
              id: id
            },
            include: [{
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            }, {
              model: Chapter,
              as: 'chapters',
              attributes: ['id', 'title', 'rank', 'createdAt'],
              order: [['rank', 'ASC'], ['id', 'DESC']]
            }, {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company']
            }]
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(Course.findByPk(id, condition));

        case 5:
          course = _context2.sent;

          if (course) {
            _context2.next = 8;
            break;
          }

          throw new Error('获取课程失败，课程不存在。');

        case 8:
          success(res, '获取课程成功。', {
            course: course
          });
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          failure(res, _context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
module.exports = router;