"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    Article = _require.Article;

var _require2 = require('../utils/responses'),
    success = _require2.success,
    failure = _require2.failure;

var _require3 = require("../utils/errors"),
    NotFoundError = _require3.NotFoundError;
/**
 * 查询文章列表
 * GET /articles
 */


router.get('/', function _callee(req, res) {
  var query, currentPage, pageSize, offset, condition, _ref, count, rows;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          query = req.query;
          currentPage = Math.abs(Number(query.currentPage)) || 1;
          pageSize = Math.abs(Number(query.pageSize)) || 10;
          offset = (currentPage - 1) * pageSize;
          condition = {
            attributes: {
              exclude: ['content']
            },
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
          };
          _context.next = 8;
          return regeneratorRuntime.awrap(Article.findAndCountAll(condition));

        case 8:
          _ref = _context.sent;
          count = _ref.count;
          rows = _ref.rows;
          success(res, '查询文章列表成功。', {
            articles: rows,
            pagination: {
              total: count,
              currentPage: currentPage,
              pageSize: pageSize
            }
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
/**
 * 查询文章详情
 * GET /articles/:id
 */

router.get('/:id', function _callee2(req, res) {
  var id, article;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Article.findByPk(id));

        case 4:
          article = _context2.sent;

          if (article) {
            _context2.next = 7;
            break;
          }

          throw new NotFoundError("ID: ".concat(id, "\u7684\u6587\u7AE0\u672A\u627E\u5230\u3002"));

        case 7:
          success(res, '查询文章成功。', {
            article: article
          });
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          failure(res, _context2.t0);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;