"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    User = _require.User;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var _require3 = require('../../utils/errors'),
    BadRequestError = _require3.BadRequestError,
    UnauthorizedError = _require3.UnauthorizedError,
    NotFoundError = _require3.NotFoundError;

var _require4 = require('../../utils/responses'),
    success = _require4.success,
    failure = _require4.failure;

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */


router.post('/sign_in', function _callee(req, res) {
  var _req$body, login, password, condition, user, isMatchValid, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, login = _req$body.login, password = _req$body.password;

          if (login) {
            _context.next = 4;
            break;
          }

          throw new BadRequestError('邮箱/用户名必须填写。');

        case 4:
          if (password) {
            _context.next = 6;
            break;
          }

          throw new BadRequestError('密码必须填写。');

        case 6:
          condition = {
            where: _defineProperty({}, Op.or, [{
              email: login
            }, {
              username: login
            }])
          }; // 通过email或username，查询用户是否存在

          _context.next = 9;
          return regeneratorRuntime.awrap(User.findOne(condition));

        case 9:
          user = _context.sent;

          if (user) {
            _context.next = 12;
            break;
          }

          throw new NotFoundError('用户不存在，无法登录。');

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 14:
          isMatchValid = _context.sent;

          if (isMatchValid) {
            _context.next = 17;
            break;
          }

          throw new UnauthorizedError('密码错误。');

        case 17:
          if (!(user.role !== 100)) {
            _context.next = 19;
            break;
          }

          throw new UnauthorizedError('您没有权限登录管理员后台。');

        case 19:
          // 生成身份验证令牌
          token = jwt.sign({
            userId: user.id
          }, process.env.SECRET, {
            expiresIn: '30d'
          });
          success(res, '登录成功。', {
            token: token
          });
          _context.next = 26;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          failure(res, _context.t0);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
module.exports = router;