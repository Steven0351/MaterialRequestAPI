import mongoose from 'mongoose';
import { Router } from 'express';
import BomRequest from '../model/bom-request';
import { authenticate } from '../middleware/auth-middleware';

export default({ config, db }) => {
  let api = Router();
  
  // 'v1/bom-request/add' - Create
  api.post('/add', authenticate, (req, res) => {
    let newBomRequest = new BomRequest();
    newBomRequest.proposedTopLevelID = req.body.proposedTopLevelID;
    newBomRequest.subcomponents = req.body.subcomponents;
    newBomRequest.requestor = req.body.requestor;

    newBomRequest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: 'New BOM Request successfully saved'});
    });
  });

  // 'v1/bom-request' - Read
  api.get('/', authenticate, (req, res) => {
    BomRequest.find({}, (err, bomRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(bomRequests);
    });
  });
  
// 'v1/bom-request


  return api;
}