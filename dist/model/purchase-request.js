'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var PurchaseRequestSchema = new Schema({
    inventoryID: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    shippingMethod: {
        type: String,
        required: true
    },
    requestor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = _mongoose2.default.model('PurchaseRequest', PurchaseRequestSchema);
//# sourceMappingURL=purchase-request.js.map