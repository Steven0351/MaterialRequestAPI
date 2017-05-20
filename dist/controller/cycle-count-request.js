'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _cycleCountRequest = require('../model/cycle-count-request');

var _cycleCountRequest2 = _interopRequireDefault(_cycleCountRequest);

var _countRequest = require('../model/count-request');

var _countRequest2 = _interopRequireDefault(_countRequest);

var _authMiddleware = require('../middleware/auth-middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // 'v1/cycle-count-request/add - Create
  api.post('/add', _authMiddleware.authentitcate, function (req, res) {
    var newCycleCountRequest = new _cycleCountRequest2.default();
    newCycleCountRequest.countRequests = req.body.countRequests;
    newCycleCountRequest.requestor = req.body.requestor;

    newCycleCountRequest.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Cycle Count Request successfully saved" });
    });
  });

  // 'v1/cycle-count-request/add/:id - Add cycle count items
  api.post('/cycle-count-request/add/:id', _authMiddleware.authentitcate, function (req, res) {
    _cycleCountRequest2.default.findById(req.params.id, function (err, cycleCountRequest) {
      if (err) {
        res.send(err);
      }
      var newCountRequest = new _countRequest2.default();

      newCountRequest.inventoryID = req.body.inventoryID;
      newCountRequest.binLocations = req.body.binLocations;
      newCountRequest.cycleCountRequest = cycleCountRequest._id;
      newCountRequest.save(function (err, countRequest) {
        if (err) {
          res.send(err);
        }
        cycleCountRequest.countRequests.push(newCountRequest);
        cycleCountRequest.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Count request successfully added' });
        });
      });
    });
  });

  // 'v1/cycle-count-request - Read
  api.get('/', _authMiddleware.authentitcate, function (req, res) {
    _cycleCountRequest2.default.find({}, function (err, cycleCountRequests) {
      if (err) {
        res.send(err);
      }
      res.json(cycleCountRequests);
    });
  });

  return api;
};
//# sourceMappingURL=cycle-count-request.js.map