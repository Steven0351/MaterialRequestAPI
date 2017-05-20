'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _purchaseRequest = require('./purchase-request');

var _purchaseRequest2 = _interopRequireDefault(_purchaseRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CreateMaterialRequestSchema = new Schema({
  manufactuerSKU: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  purchaseRequest: {
    type: Schema.Types.ObjectId,
    ref: 'PurchaseRequest'
  },
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = _mongoose2.default.model('CreateMaterialRequest', CreateMaterialRequestSchema);
//# sourceMappingURL=create-material-request.js.map