"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    Chapter = _require.Chapter,
    Course = _require.Course;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var _require3 = require('../../utils/responses'),
    success = _require3.success,
    failure = _require3.failure;

var _require4 = require('../../utils/errors'),
    NotFoundError = _require4.NotFoundError;
/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */


function getCondition() {
  return {
    // attributes: { exclude: ['CourseId'] },
    include: [{
      model: Course,
      as: 'course',
      attributes: ['id', 'name']
    }]
  };
}
/**
 * 公共方法：查询当前章节
 */


function getChapter(req) {
  var id, chapter;
  return regeneratorRuntime.async(function getChapter$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(Chapter.findByPk(id, getCondition()));

        case 3:
          chapter = _context.sent;

          if (chapter) {
            _context.next = 6;
            break;
          }

          throw new NotFoundError("ID: ".concat(id, "\u7684\u7AE0\u8282\u672A\u627E\u5230\u3002"));

        case 6:
          return _context.abrupt("return", chapter);

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
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank
  };
}
/**
 * 查询章节列表
 * 必须传入 courseId
 */


router.get('/', function _callee(req, res, next) {
  var query, courseId, title, currentPage, pageSize, offset, condition, _ref, count, rows;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          query = req.query;
          courseId = query.courseId, title = query.title;

          if (courseId) {
            _context2.next = 5;
            break;
          }

          throw new Error('查询章节列表必须传入课程 ID (courseId)。');

        case 5:
          currentPage = Math.abs(Number(query.currentPage)) || 1;
          pageSize = Math.abs(Number(query.pageSize)) || 10;
          offset = (currentPage - 1) * pageSize;
          condition = {
            where: {
              courseId: courseId
            },
            order: [['rank', 'ASC'], ['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize
          };

          if (title) {
            condition.where.title = _defineProperty({}, Op.like, "%".concat(title, "%"));
          }

          _context2.next = 12;
          return regeneratorRuntime.awrap(Chapter.findAndCountAll(condition));

        case 12:
          _ref = _context2.sent;
          count = _ref.count;
          rows = _ref.rows;
          success(res, '获取章节列表成功', {
            chapters: rows,
            pagination: {
              total: count,
              currentPage: currentPage,
              pageSize: pageSize
            }
          });
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          failure(res, _context2.t0);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
/**
 * 查询章节详情
 */

router.get('/:id', function _callee2(req, res, next) {
  var chapter;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(getChapter(req));

        case 3:
          chapter = _context3.sent;
          success(res, '查询章节成功。', {
            chapter: chapter
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
 * 创建章节
 */

router.post('/', function _callee3(req, res, next) {
  var chapter;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Chapter.create(whitelist(req)));

        case 3:
          chapter = _context4.sent;
          success(res, '创建章节成功。', {
            chapter: chapter
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
 * 更新章节
 */

router.put('/:id', function _callee4(req, res, next) {
  var chapter;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(getChapter(req));

        case 3:
          chapter = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(chapter.update(whitelist(req)));

        case 6:
          success(res, '更新章节成功。', {
            chapter: chapter
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
 * 删除章节
 */

router["delete"]('/:id', function _callee5(req, res, next) {
  var chapter;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(getChapter(req));

        case 3:
          chapter = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(chapter.destroy());

        case 6:
          success(res, '删除章节成功。');
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          failure(res, _context6.t0);

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;