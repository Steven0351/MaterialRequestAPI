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
    let newReceivingIssue = new ReceivingIssue({
      vendor: req.body.vendor,
      purchaseOrder: req.body.purchaseOrder,
      descriptionOfIssue: req.body.descriptionOfIssue,
      requestor: req.body.requestor,
      dateRequested: `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
    });
    
    newReceivingIssue.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({message: 'Receiving issue successfully created'});
      }
    });
  });

  // 'v1/receiving-issue/add/:id' - Create inventory Item for Receiving Issue
  api.post('/add/:id', authenticate, (req, res) => {
     ReceivingIssue.findOne({_id: req.params.id, requestor: req.body.requestor},
        (err, receivingIssue) => {
      if (err) {
        if (req.body.role == 'admin') {
          ReceivingIssue.findById(req.params.id, (err, receivingIssue) => {
            if (err) {
              res.status(500).send(err);
            } else {
              let receivingIssueItem = new InventoryItem({
                inventoryID: req.body.inventoryID,
                quantity: req.body.quantity,
                receivingIssue: receivingIssue._id
              });
              receivingIssueItem.save((err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  receivingIssue.inventoryItems.push(receivingIssueItem);
                  receivingIssue.save((err) => {
                    if (err) {
                      res.status(500).send(err);
                    } else {
                      res.status(200).json({message: 'Item added by admin'});
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
        let receivingIssueItem = new InventoryItem({
          inventoryID: req.body.inventoryID,
          quantity: req.body.quantity,
          receivingIssue: receivingIssue._id
        });
        receivingIssueItem.save((err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            receivingIssue.inventoryItems.push(receivingIssueItem);
            receivingIssue.save((err) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).json({message: 'Item added by admin'});
              }
            });
          }
        });
      }
    });
  });

  // 'v1/receiving-issue/:id' - Update Receiving Issue
  api.put('/:id', authenticate, (req, res) => {
    ReceivingIssue.findOneAndUpdate({_id: req.params.id, requestor: req.body.requestor},
        {$set: {vendor: req.body.vendor,
        purchaseOrder: req.body.purchaseOrder,
        descriptionOfIssue: req.body.descriptionOfIssue}}, (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          ReceivingIssue.findByIdAndUpdate(req.params.id, {$set: {vendor: req.body.vendor,
              purchaseOrder: req.body.purchaseOrder,
              descriptionOfIssue: req.body.descriptionOfIssue}}, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Receiving issue updated by admin'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        res.status(200).json({message: 'Receiving issue successfully updated'});
      }
    });
  });

  // 'v1/receiving-issue/:receivingIssue/:inventoryItem' - Update receiving issue item
  api.put('/:receivingIssue/:inventoryItem', authenticate, (req, res) => {
    ReceivingIssue.findOne({_id: req.params.receivingIssue, requestor: req.body.requestor},
        (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          InventoryItem.findByIdAndUpdate(req.params.inventoryItem, {$set: {
              inventoryID: req.body.inventoryID, quantity: req.body.quantity}}, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Item updated by admin'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.findByIdAndUpdate(req.params.inventoryItem, {$set: {
            inventoryID: req.body.inventoryID, quantity: req.body.quantity}}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Item updated by admin'});
          }
        });
      }
    });
  });

  // 'v1/receiving-issue/:id' - Delete receiving issue
  api.delete('/:id', authenticate, (req, res) => {
    ReceivingIssue.findOneAndRemove({_id: req.params.id, requestor: req.body.requestor},
        (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          ReceivingIssue.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.remove({receivingIssue: req.params.id}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Receiving issue deleted by admin'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else if (req.body.requestor != receivingIssue.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        InventoryItem.remove({receivingIssue: req.params.id}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Receiving issue successfully deleted'});
          }
        });
      }
    });
  });

  // 'v1/receiving-issue/:receivingIssue/:inventoryItem' - Delete inventory item from receiving issue
  api.delete('/:receivingIssue/:inventoryItem', authenticate, (req, res) => {
    ReceivingIssue.findOneAndUpdate({_id: req.params.receivingIssue, requestor: req.body.requestor},
       {$pull: {inventoryItems: req.params.inventoryItem}}, (err) => {
      if (err) {
        ReceivingIssue.findByIdAndUpdate(req.params.receivingIssue,
            {$pull: {inventoryItems: req.params.inventoryItem}}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            InventoryItem.findByIdAndRemove(req.params.inventoryItem, (err) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).json({message: 'Item deleted by admin'});
              }
            });
          }
        });
      } else {
        InventoryItem.findByIdAndRemove(req.params.inventoryItem, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Item deleted by admin'});
          }
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