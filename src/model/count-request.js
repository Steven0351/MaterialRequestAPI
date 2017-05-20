import mongoose from 'mongoose';
import CycleCountRequest from './cycle-count-request';
let Schema = mongoose.Schema;

let CountRequestSchema = new Schema({
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

module.exports = mongoose.model('CountRequest', CountRequestSchema); 