"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var router = express.Router();

var _require = require('../../models'),
    sequelize = _require.sequelize,
    User = _require.User;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var _require3 = require('../../utils/responses'),
    NotFoundError = _require3.NotFoundError,
    success = _require3.success,
    failure = _require3.failure;
/**
 * 统计用户性别
 * GET /admin/charts/sex
 */


router.get('/sex', function _callee(req, res) {
  var male, female, unknown, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.count({
            where: {
              sex: 0
            }
          }));

        case 3:
          male = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(User.count({
            where: {
              sex: 1
            }
          }));

        case 6:
          female = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(User.count({
            where: {
              sex: 2
            }
          }));

        case 9:
          unknown = _context.sent;
          data = [{
            value: male,
            name: '男性'
          }, {
            value: female,
            name: '女性'
          }, {
            value: unknown,
            name: '未选择'
          }];
          success(res, '查询用户性别成功。', {
            data: data
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
 * 统计每个月用户数量
 * GET /admin/charts/user
 */

router.get('/user', function _callee2(req, res) {
  var _ref, _ref2, results, data;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC"));

        case 3:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 1);
          results = _ref2[0];
          console.log('results', results);
          data = {
            months: [],
            values: []
          };
          results.forEach(function (item) {
            data.months.push(item.month);
            data.values.push(item.value);
          });
          success(res, '查询每月用户数量成功。', {
            data: data
          });
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          failure(res, _context2.t0);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
module.exports = router;