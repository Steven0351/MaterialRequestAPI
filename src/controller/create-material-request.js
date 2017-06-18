import mongoose from 'mongoose';
import { Router } from 'express';
import CreateMaterialRequest from '../schemas/create-material-request';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();
  
  // 'v1/create-material-request/add' - Create
  api.post('/add', authenticate, (req, res) => {
    let newCreateMaterialRequest = new CreateMaterialRequest({
      manufacturerSKU: req.body.manufacturerSKU,
      description: req.body.description,
      requestor: req.body.requestor,
      dateRequested: `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
    });
    newCreateMaterialRequest.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({message: 'New Create Material Request successfully saved'});
      }
    });
  });

  api.put('/:id', authenticate, (req, res) => {
    CreateMaterialRequest.findOneAndUpdate({'_id': req.params.id, 'requestor': req.body.requestor}, 
        {$set: {manufacturerSKU: req.body.manufacturerSKU, description: req.body.description}}, 
        (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          CreateMaterialRequest.findByIdAndUpdate(req.params.id, {$set: {manufacturerSKU: req.body.manufacturerSKU,
              description: req.body.description}}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Create Material Request successfully updated by admin'});
                }
              });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        res.status(200).json({message: 'Create Material Request successfully updated by requestor'});
      }
    });    
  });

  api.delete('/:id', authenticate, (req, res) => {
    CreateMaterialRequest.findOneAndRemove({'_id': req.params.id, 'requestor': req.body.requestor}, 
        (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          CreateMaterialRequest.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
              res.status.send(err);
            } else {
              res.status(200).json({message: 'Create Material Request deleted by admin'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        res.status(200).json({message: 'Create Material Request deleted by user'});
      }
    });
  });

  // 'v1/create-material-request' - Read
  api.get('/', authenticate, (req, res) => {
    CreateMaterialRequest.find({}, (err, createMaterialRequests) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(createMaterialRequests);
      }
    });
  });
  
  return api;
}