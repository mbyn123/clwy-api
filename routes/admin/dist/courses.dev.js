"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    Course = _require.Course,
    Category = _require.Category,
    User = _require.User,
    Chapter = _require.Chapter;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var _require3 = require('../../utils/responses'),
    success = _require3.success,
    failure = _require3.failure;

var _require4 = require('../../utils/errors'),
    NotFoundError = _require4.NotFoundError;
/**
 * 公共方法：关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */


function getCondition() {
  return {
    // attributes: { exclude: ['CategoryId', 'UserId'] },
    include: [{
      model: Category,
      as: 'category',
      attributes: ['id', 'name']
    }, {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'avatar']
    }]
  };
}
/**
 * 公共方法：查询当前课程
 */


function getCourse(req) {
  var id, course;
  return regeneratorRuntime.async(function getCourse$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(Course.findByPk(id, getCondition()));

        case 3:
          course = _context.sent;

          if (course) {
            _context.next = 6;
            break;
          }

          throw new NotFoundError("ID: ".concat(id, "\u7684\u8BFE\u7A0B\u672A\u627E\u5230\u3002"));

        case 6:
          return _context.abrupt("return", course);

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
 */


function whitelist(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.user.id,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content
  };
}
/**
 * 查询课程列表
 */


router.get('/', function _callee(req, res, next) {
  var query, currentPage, pageSize, offset, condition, _ref, count, rows;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          query = req.query;
          currentPage = Math.abs(Number(query.currentPage)) || 1;
          pageSize = Math.abs(Number(query.pageSize)) || 10;
          offset = (currentPage - 1) * pageSize;
          condition = _objectSpread({}, getCondition(), {
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize,
            where: {}
          }); // 模糊查询：名称

          if (query.name) {
            condition.where.name = _defineProperty({}, Op.like, "%".concat(query.name, "%"));
          } // 精确查询：分类 ID


          if (query.categoryId) {
            condition.where.categoryId = query.categoryId;
          } // 精确查询：用户 ID


          if (query.userId) {
            condition.where.userId = query.userId;
          } // 精确查询：是否推荐


          if (query.recommended !== undefined && query.recommended !== '') {
            condition.where.recommended = query.recommended === 'true';
          } // 精确查询：是否入门


          if (query.introductory !== undefined && query.introductory !== '') {
            condition.where.introductory = query.introductory === 'true';
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(Course.findAndCountAll(condition));

        case 13:
          _ref = _context2.sent;
          count = _ref.count;
          rows = _ref.rows;
          success(res, '获取课程列表成功', {
            courses: rows,
            pagination: {
              total: count,
              currentPage: currentPage,
              pageSize: pageSize
            }
          });
          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          failure(res, _context2.t0);

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
});
/**
 * 查询课程详情
 */

router.get('/:id', function _callee2(req, res, next) {
  var course;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(getCourse(req));

        case 3:
          course = _context3.sent;
          success(res, '查询课程成功。', {
            course: course
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
/**
 * 创建课程
 */

router.post('/', function _callee3(req, res, next) {
  var course;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Course.create(whitelist(req)));

        case 3:
          course = _context4.sent;
          success(res, '创建课程成功。', {
            course: course
          }, 201);
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
/**
 * 更新课程
 */

router.put('/:id', function _callee4(req, res, next) {
  var course;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(getCourse(req));

        case 3:
          course = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(course.update(whitelist(req)));

        case 6:
          success(res, '更新课程成功。', {
            course: course
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          failure(res, _context5.t0);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
/**
 * 删除课程
 */

router["delete"]('/:id', function _callee5(req, res, next) {
  var course, count;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(getCourse(req));

        case 3:
          course = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Chapter.count({
            where: {
              courseId: req.params.id
            }
          }));

        case 6:
          count = _context6.sent;

          if (!(count > 0)) {
            _context6.next = 9;
            break;
          }

          throw new Error('当前课程有章节，无法删除。');

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(course.destroy());

        case 11:
          success(res, '删除课程成功。');
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
module.exports = router;