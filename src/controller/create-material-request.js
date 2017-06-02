import mongoose from 'mongoose';
import { Router } from 'express';
import CreateMaterialRequest from '../model/create-material-request';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();
  
  // 'v1/create-material-request/add' - Create
  api.post('/add', authenticate, (req, res) => {
    let newCreateMaterialRequest = new CreateMaterialRequest();
    newCreateMaterialRequest.manufacturerSKU = req.body.manufacturerSKU;
    newCreateMaterialRequest.description = req.body.description;
    newCreateMaterialRequest.purchaseRequest = req.body.purchaseRequest;
    newCreateMaterialRequest.requestor = req.body.requestor;
    newCreateMaterialRequest.dateRequested = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;
    newCreateMaterialRequest.save(err => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(201).json({message: 'New Create Material Request successfully saved'});
    });
  });

  api.put('/:id', authenticate, (req, res) => {
    CreateMaterialRequest.findById(req.params.id, (err, createMaterialRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != createMaterialRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        createMaterialRequest.manufacturerSKU = req.body.manufacturerSKU;
        createMaterialRequest.description = req.body.description;
        createMaterialRequest.save((err) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).json({message: 'Create Material Request successfully update'});
        });
      }
    });
  });

  api.delete('/:id', authenticate, (req, res) => {
    CreateMaterialRequest.findById(req.params.id, (err, createMaterialRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != createMaterialRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        createMaterialRequest.remove((err) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).json({message: 'Create Material Request successfully deleted'});
        });
      }
    });
  });

  // 'v1/create-material-request' - Read
  api.get('/', authenticate, (req, res) => {
    CreateMaterialRequest.find({}, (err, createMaterialRequests) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(createMaterialRequests);
    });
  });
  
  return api;
}