import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let CountRequestSchema = new Schema({
  inventoryID: {
    type: String,
    required: true
  },
  binLocations: [String]
});

module.exports = mongoose.model('CountRequest', CountRequestSchema); 