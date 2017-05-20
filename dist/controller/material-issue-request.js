'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _materialIssueRequest = require('../model/material-issue-request');

var _materialIssueRequest2 = _interopRequireDefault(_materialIssueRequest);

var _authMiddleware = require('../middleware/auth-middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // 'v1/material-issue-request/add - Create
  api.post('/add', _authMiddleware.authentitcate, function (req, res) {
    var newMaterialIssueRequest = new _materialIssueRequest2.default();
    newMaterialIssueRequest.inventoryID = req.body.inventoryID;
    newMaterialIssueRequest.workOrder = req.body.workOrder;
    newMaterialIssueRequest.requestor = req.body.requestor;

    newMaterialIssueRequest.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Material Issue Request saved successfully' });
    });
  });

  // 'v1/material-issue-request - Read
  api.get('/', _authMiddleware.authentitcate, function (req, res) {
    _materialIssueRequest2.default.find({}, function (err, materialIssueRequests) {
      if (err) {
        res.send(err);
      }
      res.json(materialIssueRequests);
    });
  });

  return api;
};
//# sourceMappingURL=material-issue-request.js.map