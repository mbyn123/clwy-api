"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    Course = _require.Course,
    Category = _require.Category,
    User = _require.User;

var _require2 = require('../utils/responses'),
    success = _require2.success,
    failure = _require2.failure;
/* GET home page. */


router.get('/home', function _callee(req, res, next) {
  var recommendedCourses, likesCourses, introductoryCourses;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Course.findAll({
            attributes: {
              exclude: ['CategoryId', 'UserId', 'content']
            },
            include: [{
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            }, {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company']
            }],
            where: {
              recommended: true
            },
            order: [['id', 'desc']],
            limit: 10
          }));

        case 3:
          recommendedCourses = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(Course.findAll({
            attributes: {
              exclude: ['CategoryId', 'UserId', 'content']
            },
            order: [['likesCount', 'desc'], ['id', 'desc']],
            limit: 10
          }));

        case 6:
          likesCourses = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(Course.findAll({
            attributes: {
              exclude: ['CategoryId', 'UserId', 'content']
            },
            where: {
              introductory: true
            },
            order: [['id', 'desc']],
            limit: 10
          }));

        case 9:
          introductoryCourses = _context.sent;
          success(res, '获取首页数据成功。', {
            recommendedCourses: recommendedCourses,
            likesCourses: likesCourses,
            introductoryCourses: introductoryCourses
          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          failure(res, _context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
module.exports = router;