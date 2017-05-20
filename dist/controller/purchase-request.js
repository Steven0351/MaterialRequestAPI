'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _purchaseRequest = require('../model/purchase-request');

var _purchaseRequest2 = _interopRequireDefault(_purchaseRequest);

var _authMiddleware = require('../middleware/auth-middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // '/v1/purchaserequest/add - Create
  api.post('/add', _authMiddleware.authenitcate, function (req, res) {
    var newPurchaseRequest = new _purchaseRequest2.default();
    newPurchaseRequest.inventoryID = req.body.inventoryID;
    newPurchaseRequest.quantity = req.body.quantity;
    newPurchaseRequest.shippingMethod = req.body.shippingMethod;

    newPurchaseRequest.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Purchase Request saved successfully' });
    });
  });

  // 'v1/purchaserequest - Read
  api.get('/', function (req, res) {
    _purchaseRequest2.default.find({}, function (err, purchaseRequests) {
      if (err) {
        res.send(err);
      }
      res.json(purchaseRequests);
    });
  });
};
//# sourceMappingURL=purchase-request.js.map