import mongoose from 'mongoose';
import { Router } from 'express';
import MaterialIssueRequest from '../schemas/material-issue-request';
import { authenticate } from '../middleware/auth-middleware';

let today = Date();

export default({ config, db }) => {
  let api = Router();

  // 'v1/material-issue-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newMaterialIssueRequest = new MaterialIssueRequest({
      workOrder: req.body.workOrder,
      requestor: req.body.requestor,
      isComplete: req.body.isComplete || false,
      dateRequested: `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
    });

    newMaterialIssueRequest.save(err => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({ message: 'Material Issue Request saved successfully'});
      }
    });
  });

  // 'v1/material-issue-request/inventory-items/add/:id' - Add InventoryItem to MaterialIssueRequest
  api.post('/add/:id', authenticate, (req, res) => {
    MaterialIssueRequest.findOne({_id: req.params.id, requestor: req.body.requestor}, (err, issueRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          MaterialIssueRequest.findById(req.params.id, (err, issueRequest) => {
            if (err) {
              res.status(500).send(err);
            } else {
              let itemToIssue = new InventoryItem({
                inventoryID: req.body.inventoryID,
                quantity: req.body.quantity,
                materialIssueRequest: issueRequest._id
              });
              itemToIssue.save((err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  issueRequest.inventoryItems.push(itemToIssue);
                  issueRequest.save((err) => {
                    if (err) {
                      res.status(500).send(err);
                    } else {
                      res.status(200).json({message: 'Inventory Item added to material issue request by admin'});
                    }
                  });
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        let itemToIssue = new InventoryItem({
          inventoryID: req.body.inventoryID,
          quantity: req.body.quantity,
          materialIssueRequest: issueRequest._id
        });
        itemToIssue.save((err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            issueRequest.inventoryItems.push(itemToIssue);
            issueRequest.save((err) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).json({message: 'Inventory Item added to material issue request by admin'});
              }
            });
          }
        });
      }
    });
  });

  // 'v1/material-issue-request/:id - Update
  api.put('/:id', authenticate, (req, res) => {
    MaterialIssueRequest.findOneAndUpdate({_id: req.params.id, requestor: req.body.requestor},
        {$set: {workOrder: req.body.workOrder, isComplete: req.body.isComplete}}, (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          MaterialIssueRequest.findByIdAndUpdate(req.params.id, {$set: {workOrder: req.body.workOrder,
              isComplete: req.body.isComplete}}, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Material issue request updated by admin'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        res.json({message: 'Material issue request successfully updated'});
      }
    });
  });

  // 'v1/material-issue-request/:id - Delete
  api.delete('/:id', authenticate, (req, res) => {
    MaterialIssueRequest.findOneAndRemove({_id: req.params.id, requestor: req.body.requestor},
        (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          MaterialIssueRequest.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.remove({materialIssueRequest: req.params.id}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Material issue request deleted by admin'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.remove({materialIssueRequest: req.params.id}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Successfully deleted material issue request'});
          }
        });
      }
    });
  });

  // 'v1/material-issue-request - Read
  api.get('/', authenticate, (req, res) => {
    MaterialIssueRequest.find({}, (err, materialIssueRequests) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(materialIssueRequests);
      }
    });
  });

  return api;
}