import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';

let app = express();
app.server = http.createServer(app);

// Middleware
// parse application/json
app.user(bodyParser.json({
  limit: config.bodyLimit
}));

// Passport config
app.use(passport.initialize());
let User = require('./model/user');
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// api routes v1
app.use('/api/v1', routes);

app.server.listen(config.port());
console.log(`Started on port ${app.server.address().port}`);

export default app;