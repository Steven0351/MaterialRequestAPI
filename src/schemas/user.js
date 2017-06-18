import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
let Schema = mongoose.Schema;

let User = new Schema({
  username: String,
  password: String
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);