'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _authMiddleare = require('../middleware/auth-middleare');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // '/v1/account'
  // need to add User.role to the register endpoint
  api.post('/register', function (req, res) {
    _user2.default.register(new _user2.default({ name: req.body.username }), req.body.password, function (err, account) {
      if (err) {
        if (err.name === "UserExistsError") {
          console.log("User Exists");
          return res.status(409).send(err);
        } else {
          return res.status(500).send(err);
        }
      }

      _passport2.default.authenticate('local', {
        session: false
      })(req, res, function () {
        res.status(200).send('Successfully created new account');
      });
    });
  });

  // 'v1/account/login'
  api.post('/login', _passport2.default.authenticate('local', {
    session: false,
    scope: []
  }), _authMiddleare.generateAccessToken, _authMiddleare.respond);

  // 'v1/account/logout'
  api.get('/logout', _authMiddleare.authenticate, function (req, res) {
    res.logout();
    res.status(200).send('Successfully logged out');
  });

  // 'v1/account/me
  api.get('/me', _authMiddleare.authenticate, function (req, res) {
    res.status(200).json(req.user);
  });

  return api;
};
//# sourceMappingURL=user.js.map