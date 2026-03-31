"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    User = _require.User;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var _require3 = require('../../utils/responses'),
    success = _require3.success,
    failure = _require3.failure;

var _require4 = require('../../utils/errors'),
    NotFoundError = _require4.NotFoundError;
/**
 * 公共方法：查询当前用户
 */


function getUser(req) {
  var id, user;
  return regeneratorRuntime.async(function getUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findByPk(id));

        case 3:
          user = _context.sent;

          if (user) {
            _context.next = 6;
            break;
          }

          throw new NotFoundError("ID: ".concat(id, "\u7684\u7528\u6237\u672A\u627E\u5230\u3002"));

        case 6:
          return _context.abrupt("return", user);

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
 * @returns {{password, role, nickname, company, introduce, sex, avatar, email, username}}
 */


function whitelist(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar
  };
}
/* 查询用户列表 */


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
          condition = {
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize,
            where: {}
          };

          if (query.email) {
            condition.where.email = _defineProperty({}, Op.like, "%".concat(query.email, "%"));
          }

          if (query.username) {
            condition.where.username = _defineProperty({}, Op.like, "%".concat(query.username, "%"));
          }

          if (query.nickname) {
            condition.where.nickname = _defineProperty({}, Op.like, "%".concat(query.nickname, "%"));
          }

          if (query.role) {
            condition.where.role = query.role;
          }

          _context2.next = 12;
          return regeneratorRuntime.awrap(User.findAndCountAll(condition));

        case 12:
          _ref = _context2.sent;
          count = _ref.count;
          rows = _ref.rows;
          success(res, '查询用户列表成功。', {
            users: rows,
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
/* 查询用户详情 */

router.get('/:id', function _callee2(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(getUser(req));

        case 3:
          user = _context3.sent;
          success(res, '查询用户成功。', {
            user: user
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
/* 创建用户 */

router.post('/', function _callee3(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.create(whitelist(req)));

        case 3:
          user = _context4.sent;
          success(res, '创建用户成功。', {
            user: user
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
/* 更新用户 */

router.put('/:id', function _callee4(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(getUser(req));

        case 3:
          user = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(user.update(whitelist(req)));

        case 6:
          success(res, '更新用户成功。', {
            user: user
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
}); // /* 删除用户 */
// router.delete('/:id', async function (req, res, next) {
//     try {
//         const user = await getUser(req);
//         await user.destroy();
//         success(res, '删除用户成功。');
//     } catch (error) {
//         failure(res, error);
//     }
// });

module.exports = router;