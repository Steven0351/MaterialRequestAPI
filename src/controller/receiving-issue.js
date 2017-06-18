import mongoose from 'mongoose';
import { Router } from 'express';
import ReceivingIssue from '../schemas/receiving-issue';
import InventoryItem from '../schemas/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();

  // 'v1/receiving-issue/add - Create Receiving Issue
  api.post('/add', authenticate, (req, res) => {
    let newReceivingIssue = new ReceivingIssue();
    newReceivingIssue.vendor = req.body.vendor;
    newReceivingIssue.purchaseOrder = req.body.purchaseOrder;
    newReceivingIssue.descriptionOfIssue = req.body.descriptionOfIssue;
    newReceivingIssue.requestor = req.body.requestor;
    newReceivingIssue.dateRequested = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;

    newReceivingIssue.save((err) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(201).json({message: 'Receiving issue successfully created'});
    });
  });

  // 'v1/receiving-issue/inventory-items/add/:id' - Create inventory Item for Receiving Issue
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
     ReceivingIssue.findById(req.params.id, (err, receivingIssue) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != receivingIssue.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        let receivingIssueItem = new InventoryItem();
        receivingIssueItem.inventoryID = req.body.inventoryID;
        receivingIssueItem.quantity = req.body.quantity;
        receivingIssueItem.receivingIssue = receivingIssue._id;
        receivingIssueItem.save((err) => {
          if (err) {
            res.status(500).send(err);
          }
          receivingIssue.inventoryItems.push(receivingIssueItem);
          receivingIssue.save((err) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(201).json({message: 'Inventory Item successfully added to receiving issue'});
          });
        });
      }
    });
  });

  // 'v1/receiving-issue/:id' - Update Receiving Issue
  api.put('/:id', authenticate, (req, res) => {
    ReceivingIssue.findById(req.params.id, (err, receivingIssue) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != receivingIssue.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        receivingIssue.vendor = req.body.vendor;
        receivingIssue.purchaseOrder = req.body.purchaseOrder;
        receivingIssue.descriptionOfIssue = req.body.descriptionOfIssue;
        receivingIssue.save((err) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).json({message: 'Receiving issue successfully updated'});
        });
      }
    });
  });

  // 'v1/receiving-issue/:receivingIssue/:inventoryItem' - Update receiving issue item
  api.put('/inventory-items/:receivingIssue/:inventoryItem', authenticate, (req, res) => {
    ReceivingIssue.findById(req.params.receivingIssue, (err, receivingIssue) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != receivingIssue.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        InventoryItem.findById(req.params.inventoryItem, (err, inventoryItem) => {
          if (err) {
            res.status(500).send(err);
          }
          inventoryItem.inventoryID = req.body.inventoryID;
          inventoryItem.quantity = req.body.quantity;
          inventoryItem.save((err) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(200).json({message: 'Inventory item successfully updated'});
          });
        });
      }
    });
  });

  // 'v1/receiving-issue/:id' - Delete receiving issue
  api.delete('/:id', authenticate, (req, res) => {
    ReceivingIssue.findById(req.params.receivingIssue, (err, receivingIssue) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != receivingIssue.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        ReceivingIssue.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            res.status(500).send(err);
          }
          InventoryItem.remove({receivingIssue: req.params.id}, (err) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(200).json({message: 'Receiving issue successfully deleted'});
          });
        });
      }
    });
  });

  // 'v1/receiving-issue/:receivingIssue/:inventoryItem' - Delete inventory item from receiving issue
  api.delete('/:receivingIssue/:inventoryItem', authenticate, (req, res) => {
    ReceivingIssue.findById(req.params.receivingIssue, (err, receivingIssue) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != receivingIssue.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        InventoryItem.findByIdAndRemove(req.params.inventoryItem, (err) => {
          if (err) {
            res.status(500).send(err);
          }
          ReceivingIssue.findByIdAndUpdate(req.params.receivingIssue, {$pull: {inventoryItems: req.params.inventoryItem}}, (err) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(200).json({message: 'Inventory item succesfully removed from receiving issue'});
          });
        });
      }
    });
  });

  // 'v1/receiving-issue/' - Read all receiving issues
  api.get('/', authenticate, (req, res) => {
    ReceivingIssue.find({}, (err, receivingIssues) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(receivingIssues);
    });
  });

  return api;
}