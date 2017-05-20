'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _countRequest = require('./count-request');

var _countRequest2 = _interopRequireDefault(_countRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CycleCountRequestSchema = new Schema({
  countRequests: [{ type: Schema.Types.ObjectId, ref: 'CountRequest', required: true }],
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = _mongoose2.default.model('CycleCountRequest', CycleCountRequestSchema);
//# sourceMappingURL=cycle-count-request.js.map