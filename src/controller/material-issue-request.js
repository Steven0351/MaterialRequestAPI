import mongoose from 'mongoose';
import { Router } from 'express';
import MaterialIssueRequest from '../model/material-issue-request';
import { authenticate } from '../middleware/auth-middleware';

export default({ config, db }) => {
  let api = Router();

  // 'v1/material-issue-request/add - Create
  api.post('/add', authenticate, (req, res) => {
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

  // 'v1/material-issue-request/inventory-items/add/:id' - Add InventoryItem to MaterialIssueRequest
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
      MaterialIssueRequest.findById(req.params.id, (err, issueRequest) => {
        if (err) {
          res.send(err);
        }
        let itemToIssue = new InventoryItem();

        itemToIssue.inventoryID = req.body.inventoryID;
        itemToIssue.quantity = req.body.quantity;
        itemToIssue.materialIssueRequest = issueRequest._id;
        itemToIssue.save((err, toIssue) => {
          if (err) {
            res.send(err);
          }
          issueRequest.inventoryToBeIssued.push(itemToIssue);
          issueRequest.save((err) => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'Inventory Item successfully added to material issue request'});
          });
        });
      });
    });

  // 'v1/material-issue-request - Read
  api.get('/', authenticate, (req, res) => {
    MaterialIssueRequest.find({}, (err, materialIssueRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(materialIssueRequests);
    });
  });

  return api;
}