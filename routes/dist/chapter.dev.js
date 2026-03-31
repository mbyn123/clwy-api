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

var _require3 = require("../utils/errors"),
    NotFoundError = _require3.NotFoundError;
/**
 * 查询章节详情
 * GET /chapters/:id
 */


router.get('/:id', function _callee(req, res) {
  var id, condition, chapter, chapters;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.params.id;
          condition = {
            attributes: {
              exclude: ['CourseId']
            },
            include: [{
              model: Course,
              as: 'course',
              attributes: ['id', 'name'],
              include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'nickname', 'avatar', 'company']
              }]
            }]
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(Chapter.findByPk(id, condition));

        case 5:
          chapter = _context.sent;

          if (chapter) {
            _context.next = 8;
            break;
          }

          throw new NotFoundError("ID: ".concat(id, "\u7684\u7AE0\u8282\u672A\u627E\u5230\u3002"));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(Chapter.findAll({
            attributes: {
              exclude: ['CourseId', 'content']
            },
            where: {
              courseId: chapter.courseId
            },
            order: [['rank', 'ASC'], ['id', 'DESC']]
          }));

        case 10:
          chapters = _context.sent;
          success(res, '查询章节成功。', {
            chapter: chapter,
            chapters: chapters
          });
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          failure(res, _context.t0);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
module.exports = router;