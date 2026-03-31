"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    Setting = _require.Setting;

var _require2 = require('../../utils/responses'),
    success = _require2.success,
    failure = _require2.failure;

var _require3 = require('../../utils/errors'),
    NotFoundError = _require3.NotFoundError;
/**
 * 公共方法：查询系统设置
 */


function getSetting() {
  var setting;
  return regeneratorRuntime.async(function getSetting$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Setting.findOne());

        case 2:
          setting = _context.sent;

          if (setting) {
            _context.next = 5;
            break;
          }

          throw new NotFoundError('系统设置未找到。');

        case 5:
          return _context.abrupt("return", setting);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}
/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, icp, copyright}}
 */


function whitelist(req) {
  var _req$body = req.body,
      name = _req$body.name,
      icp = _req$body.icp,
      copyright = _req$body.copyright;
  return {
    name: name,
    icp: icp,
    copyright: copyright
  };
}
/* 查询系统设置 */


router.get('/', function _callee(req, res, next) {
  var setting;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(getSetting());

        case 3:
          setting = _context2.sent;
          success(res, '查询系统设置成功。', {
            setting: setting
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          failure(res, _context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
/* 更新系统设置 */

router.put('/', function _callee2(req, res, next) {
  var setting;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(getSetting());

        case 3:
          setting = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(setting.update(whitelist(req)));

        case 6:
          success(res, '更新系统设置成功。', {
            setting: setting
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          failure(res, _context3.t0);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;