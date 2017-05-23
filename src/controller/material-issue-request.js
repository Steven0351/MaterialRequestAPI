import mongoose from 'mongoose';
import { Router } from 'express';
import MaterialIssueRequest from '../model/material-issue-request';
import { authenticate } from '../middleware/auth-middleware';

let today = Date();

export default({ config, db }) => {
  let api = Router();

  // 'v1/material-issue-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newMaterialIssueRequest = new MaterialIssueRequest();
    newMaterialIssueRequest.inventoryToBeIssued = req.body.inventoryToBeIssued;
    newMaterialIssueRequest.workOrder = req.body.workOrder;
    newMaterialIssueRequest.requestor = req.body.requestor;
    newMaterialIssueRequest.dateRequested = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;

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

        itemToIssue.inventoryToBeIssued = req.body.inventoryToBeIssued;
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

  // 'v1/material-issue-request/:id - Update
  api.put('/:id', authenticate, (req, res) => {
    MaterialIssueRequest.findById(req.params.id, (err, materialIssueRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != purchaseRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this request'});
        return;
      }
      materialIssueRequest.inventoryToBeIssued = req.body.inventoryToBeIssued;
      materialIssueRequest.workOrder = req.body.workOrder;
      materialIssueRequest.requestor = req.body.requestor;
      materialIssueRequest.save((err) => {
        if (err) {
          res.send(err);
        }
        res.json({message: 'Material issue request successfully updated'});
      });
    });
  });

  // 'v1/material-issue-request/:id - Delete
  api.delete('/:id', authenticate, (req, res) => {
    MaterialIssueRequest.findById({_id: req.params.id}, (err, materialIssueRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (materialIssueRequest == null) {
        res.status(404).send('Material issue request not found');
      } else if (req.body.requestor != materialIssueRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to delete this request'});
        return;
      }
      MaterialIssueRequest.remove({_id: req.params.id}, (err, materialIssueRequest) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        InventoryItem.remove({materialIssueRequest: req.params.id}, (err, inventoryItem) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.json({message: 'Successfully deleted material issue request'});
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