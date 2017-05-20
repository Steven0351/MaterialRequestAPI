import jwt from 'jsonwebtoken';
import expressjwt from 'express-jwt';

const TOKENTIME = 60*60*24 //One day
const SECRET = "GD7 M4NUF4C7UR1NG 0351031614**!"

let authenticate = expressjwt({secret: SECRET});
let generateAccessToken = (req, res, next) => {
  req.token = req.token || {};
  req.token = jwt.sign({
    id: req.user.id,
  }, SECRET, {
    expiresIn: TOKENTIME
  });
  next();
}

let respond = (req, res) => {
  req.status(200).json({
    user: req.user.username,
    token: req.token
  });
}

module.exports = {
  authenticate,
  generateAccessToken,
  respond
}