'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _createMaterialRequest = require('../model/create-material-request');

var _createMaterialRequest2 = _interopRequireDefault(_createMaterialRequest);

var _authMiddleware = require('../middleware/auth-middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // 'v1/bom-request/add' - Create
  api.post('/add', _authMiddleware.authentitcate, function (req, res) {
    var newCreateMaterialRequest = new _createMaterialRequest2.default();
    newCreateMaterialRequest.proposedTopLevelID = req.body.proposedTopLevelID;
    newCreateMaterialRequest.subcomponents = req.body.subcomponents;
    newCreateMaterialRequest.requestor = req.body.requestor;

    newCreateMaterialRequest.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'New BOM Request successfully saved' });
    });
  });

  // 'v1/bom-request' - Read
  api.get('/', _authMiddleware.authentitcate, function (req, res) {
    _createMaterialRequest2.default.find({}, function (err, createMaterialRequests) {
      if (err) {
        res.send(err);
      }
      res.json(createMaterialRequests);
    });
  });

  return api;
};
//# sourceMappingURL=create-material-request.js.map