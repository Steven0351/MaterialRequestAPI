'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _ = require('');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Still need to add source file imports for controller files
var router = (0, _express2.default)();

// connect to database
(0, _db2.default)(function (db) {

  // internal middleware
  router.use((0, _middleware2.default)({ config: _config2.default, db: db }));
  // api routes v1 
  router.use('/bom-request', (0, _2.default)({ config: _config2.default, db: db }));
  router.use('/create-material-request', (0, _2.default)({ config: _config2.default, db: db }));
  router.use('/cycle-count-request', (0, _2.default)({ config: _config2.default, db: db }));
  router.use('/material-issue-request', (0, _2.default)({ config: _config2.default, db: db }));
  router.use('/purchase-request', (0, _2.default)({ config: _config2.default, db: db }));
  router.use('/user', (0, _2.default)({ config: _config2.default, db: db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map