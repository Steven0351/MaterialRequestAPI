import mongoose from 'mongoose';
import User from './user';
let Schema = mongoose.Schema;

let UserRoleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('UserRole', UserRoleSchema);