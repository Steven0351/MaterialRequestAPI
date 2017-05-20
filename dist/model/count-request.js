'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cycleCountRequest = require('./cycle-count-request');

var _cycleCountRequest2 = _interopRequireDefault(_cycleCountRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CountRequestSchema = new Schema({
  inventoryID: {
    type: String,
    required: true
  },
  binLocations: [String],
  cycleCountRequest: {
    type: Schema.Types.ObjectId,
    ref: 'CycleCountRequest',
    required: true
  }
});

module.exports = _mongoose2.default.model('CountRequest', CountRequestSchema);
//# sourceMappingURL=count-request.js.map