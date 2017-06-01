import mongoose from 'mongoose';
import { Router } from 'express';
import { authenticate } from '../middleware/auth-middleware';
import User from '../model/user';
import UserInformation from '../model/user-information';

export default({ config, db }) => {
  let api = Router();

  // 'v1/user-information/add' - Create User information
  api.post('/add', authenticate, (req, res) => {
    let newUserInformation = new UserInformation();
    newUserInformation.user = req.body.user;
    newUserInformation.role = req.body.role;
    newUserInformation.firstName = req.body.firstName;
    newUserInformation.lastName = req.body.lastName;
    newUserInformation.save((err) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(201).json({message: 'User information successfully created'});
    });
  });

// 'v1/user-information/:id' - Update User information
api.put('/:id', authenticate, (req, res) => {
  UserInformation.findById(req.params.id, (err, userInformation) => {
    userInformation.role = req.body.role;
    userInformation.firstName = req.body.firstName;
    userInformation.lastName = req.body.lastName;
    userInformation.save((err) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json({message: 'User information successfully updated'});
    });
  });
});

// 'v1/user-information/:id' - Delete User information
api.delete('/:id', authenticate, (req, res) => {
  if (req.body.role != 'admin') {
    res.status(403).json({message: 'You do not have permission to delete user information'});
  } else {
    UserInformation.findByIdAndRemove(req.params.id, (err, userInformation) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json({message: `Successfully deleted ${userInformation.firstName} 
        ${userInformation.lastName}'s user information`});
    });
  }
});

// 'v1/user-information/' - Read all user information
api.get('/', authenticate, (req, res) => {
  if (req.body.role != 'admin') {
    res.status(403).json({message: "You do not have permission to read other user's information"});
  } else {
    UserInformation.find({}, (err, usersInformation) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(usersInformation);
    });
  }
});

// 'v1/user-information/:id' - Read specific user information
api.get('/:id', authenticate, (req, res) => {
  if (req.body.role != 'admin' || req.body.user != req.params.id) {
    res.status(403).json({message: "You do not have permission to read other user's information"});
  } else {
    UserInformation.findById(req.params.id, (err, userInformation) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(userInformation);
    });
  }
});

  return api;
}
