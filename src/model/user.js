import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
let Schema = mongoose.Schema;

let user = new Schema({
  name: String,
  password: String
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', user);