import mongoose from 'mongoose';
import { Router } from 'express';
import MaterialIssueRequest from '../model/material-issue-request';
import { authentitcate } from '../middleware/auth-middleware';

export default({ config, db }) => {
  let api = Router();

  // 'v1/material-issue-request/add - Create
  api.post('/add', authentitcate, (req, res) => {
    let newMaterialIssueRequest = new MaterialIssueRequest();
    newMaterialIssueRequest.inventoryID = req.body.inventoryID;
    newMaterialIssueRequest.workOrder = req.body.workOrder;
    newMaterialIssueRequest.requestor = req.body.requestor;

    newMaterialIssueRequest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Material Issue Request saved successfully'});
    });
  });

  // 'v1/material-issue-request - Read
  api.get('/', authentitcate, (req, res) => {
    MaterialIssueRequest.find({}, (err, materialIssueRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(materialIssueRequests);
    });
  });

  return api;
}