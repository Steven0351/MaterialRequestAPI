import mongoose from 'mongoose';
import { Router } from 'express';
import CreateMaterialRequest from '../model/create-material-request';
import { authenticate } from '../middleware/auth-middleware';

export default({ config, db }) => {
  let api = Router();
  
  // 'v1/create-material-request/add' - Create
  api.post('/add', authenticate, (req, res) => {
    let newCreateMaterialRequest = new CreateMaterialRequest();
    newCreateMaterialRequest.manufacturerSKU = req.body.manufacturerSKU;
    newCreateMaterialRequest.description = req.body.description;
    newCreateMaterialRequest.purchaseRequest = req.body.purchaseRequest;
    newCreateMaterialRequest.requestor = req.body.requestor;

    newCreateMaterialRequest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: 'New BOM Request successfully saved'});
    });
  });

  // 'v1/create-material-request' - Read
  api.get('/', authenticate, (req, res) => {
    CreateMaterialRequest.find({}, (err, createMaterialRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(createMaterialRequests);
    });
  });
  
  return api;
}