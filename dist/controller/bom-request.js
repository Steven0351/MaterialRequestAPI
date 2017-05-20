'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _bomRequest = require('../model/bom-request');

var _bomRequest2 = _interopRequireDefault(_bomRequest);

var _authMiddleware = require('../middleware/auth-middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // 'v1/bom-request/add' - Create
  api.post('/add', _authMiddleware.authentitcate, function (req, res) {
    var newBomRequest = new _bomRequest2.default();
    newBomRequest.proposedTopLevelID = req.body.proposedTopLevelID;
    newBomRequest.subcomponents = req.body.subcomponents;
    newBomRequest.requestor = req.body.requestor;

    newBomRequest.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'New BOM Request successfully saved' });
    });
  });

  // 'v1/bom-request' - Read
  api.get('/', _authMiddleware.authentitcate, function (req, res) {
    _bomRequest2.default.find({}, function (err, bomRequests) {
      if (err) {
        res.send(err);
      }
      res.json(bomRequests);
    });
  });

  return api;
};
//# sourceMappingURL=bom-request.js.map