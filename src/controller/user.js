import mongoose from 'mongoose';
import { Router } from 'express';
import User from '../model/user';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';

import { generateAccessToken, respond, authenticate } from '../middleware/auth-middleare';

export default ({ config, db }) => {
  let api = Router();

  // '/v1/account'
  // need to add User.role to the register endpoint
  api.post('/register', (req, res) => {
    User.register(new User({ name: req.body.username}), req.body.password, function(err, account) {
      if (err) {
        if(err.name === "UserExistsError") {
          console.log("User Exists");
          return res.status(409).send(err);
        } else {
          return res.status(500).send(err);
        }
      }

      passport.authenticate(
        'local', {
          session: false
        })(req, res, () => {
          res.status(200).send('Successfully created new account');
        });
    });
  });

  // 'v1/account/login'
  api.post('/login', passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), generateAccessToken, respond);

  // 'v1/account/logout'
  api.get('/logout', authenticate, (req, res) => {
    res.logout();
    res.status(200).send('Successfully logged out');
  });

  // 'v1/account/me
  api.get('/me', authenticate, (req, res) => {
    res.status(200).json(req.user);
  });

  return api;
}