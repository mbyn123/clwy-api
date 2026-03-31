"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    Article = _require.Article;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var _require3 = require('../../utils/responses'),
    success = _require3.success,
    failure = _require3.failure;

var _require4 = require('../../utils/errors'),
    NotFoundError = _require4.NotFoundError;
/**
 * 公共方法：查询当前文章
 */


function getArticle(req) {
  var id, article;
  return regeneratorRuntime.async(function getArticle$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 获取文章 ID
          id = req.params.id; // 查询当前文章

          _context.next = 3;
          return regeneratorRuntime.awrap(Article.findByPk(id));

        case 3:
          article = _context.sent;

          if (article) {
            _context.next = 6;
            break;
          }

          throw new NotFoundError("ID: ".concat(id, "\u7684\u6587\u7AE0\u672A\u627E\u5230\u3002"));

        case 6:
          return _context.abrupt("return", article);

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
 * @returns {{title, content}}
 */


function whitelist(req) {
  var _req$body = req.body,
      title = _req$body.title,
      content = _req$body.content;
  return {
    title: title,
    content: content
  };
}
/* 查询文章列表 */


router.get('/', function _callee(req, res, next) {
  var query, currentPage, pageSize, offset, condition, title, _ref, count, rows;

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

          offset = (currentPage - 1) * pageSize; // 创建时间倒序排序

          condition = {
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize
          };
          /** 模糊查询 */

          title = req.query.title;

          if (title) {
            condition.where = {
              title: _defineProperty({}, Op.like, "%".concat(title, "%"))
            };
          } // const articles = await Article.findAll(condition);


          _context2.next = 10;
          return regeneratorRuntime.awrap(Article.findAndCountAll(condition));

        case 10:
          _ref = _context2.sent;
          count = _ref.count;
          rows = _ref.rows;
          success(res, '获取文章列表成功', {
            articles: rows,
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
/* 查询文章详情 */

router.get('/:id', function _callee2(req, res, next) {
  var article;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(getArticle(req));

        case 3:
          article = _context3.sent;
          success(res, '查询文章成功。', {
            article: article
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
/* 创建文章 */

router.post('/', function _callee3(req, res, next) {
  var article;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Article.create(whitelist(req)));

        case 3:
          article = _context4.sent;
          success(res, '创建文章成功。', {
            article: article
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
/* 删除文章 */

router["delete"]('/:id', function _callee4(req, res, next) {
  var article;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(getArticle(req));

        case 3:
          article = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(article.destroy());

        case 6:
          success(res, '删除文章成功。');
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
/* 更新文章 */

router.put('/:id', function _callee5(req, res, next) {
  var article;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(getArticle(req));

        case 3:
          article = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(article.update(whitelist(req)));

        case 6:
          success(res, '更新文章成功。', {
            article: article
          });
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