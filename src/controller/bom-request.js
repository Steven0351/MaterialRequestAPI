import mongoose from 'mongoose';
import { Router } from 'express';
import BomRequest from '../model/bom-request';
import InventoryItem from '../model/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();
  
  // 'v1/bom-request/add' - Create
  api.post('/add', authenticate, (req, res) => {
    let newBomRequest = new BomRequest();
    newBomRequest.proposedTopLevelID = req.body.proposedTopLevelID;
    newBomRequest.requestor = req.body.requestor;
    newBomRequest.dateRequested = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;
    newBomRequest.save(err => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(201).json({message: 'New BOM Request successfully saved'});
    });
  });

  // 'v1/bom-request/inventory-items/add/:id - add subcomponents to BomRequest 
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
    BomRequest.findOne({_id: req.params.id, requestor: req.body.requestor},
         (err, bomRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          BomRequest.findById(req.params.id, (err, bomRequest) => {
            let newSubcomponent = new InventoryItem();
            newSubcomponent.inventoryID = req.body.inventoryID;
            newSubcomponent.quantity = req.body.quantity;
            newSubcomponent.bomRequest = bomRequest._id;
            newSubcomponent.save((err, bomRequestSuccess) => {
              if (err) {
                res.status(500).send(err);
              } else {
                bomRequest.inventoryItems.push(newSubcomponent);
                bomRequest.save((err) => {
                  if (err) {
                    res.status(500).send(err);
                  }
                });
              }
            });
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        let newSubcomponent = new InventoryItem();
        newSubcomponent.inventoryID = req.body.inventoryID;
        newSubcomponent.quantity = req.body.quantity;
        newSubcomponent.bomRequest = bomRequest._id;
        newSubcomponent.save((err, bomRequestSuccess) => {
          if (err) {
            res.status(500).send(err);
          }
          bomRequest.inventoryItems.push(newSubcomponent);
          bomRequest.save((err) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(200).json({message: 'Inventory Item successfully added to BOM request'});
          });
        });
      }
    });
  });

  api.put('/:id', authenticate, (req, res) => {
    BomRequest.findOneAndUpdate({_id: req.params.id, requestor: req.body.requestor},
        {$set: {proposedTopLevelID: req.body.proposedTopLevelID}}, (err, bomRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          BomRequest.findByIdAndUpdate(req.params.id,
              {$set: {proposedTopLevelID: req.body.proposedTopLevelID }}, (err, bomRequest) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'BOM Request successfully changed by admin'});
                }
              });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        res.status(200).json({message: 'BOM Request Successfully Updated'});
      }
    });
  });

  // 'v1/bom-request/inventory-items/:bomRequest/:inventoryID - Update Inventory Item
  api.put('/inventory-items/:bomRequest/:id', authenticate, (req, res) => {
    BomRequest.findOne({_id: req.params.bomRequest, requestor: req.body.requestor},
         (err, bomRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          InventoryItem.findByIdAndUpdate(req.params.id, {$set: {inventoryID: req.body.inventoryID,
              quantity: req.body.quantity}}, (err, inventoryItem) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Inventory item successfully updated by admin'})
                }
              });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.findByIdAndUpdate(req.params.id, {$set: {inventoryID: req.body.inventoryID,
              quantity: req.body.quantity}}, (err, inventoryItem) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Inventory item successfully updated'});
          }
        });
      } 
    });
  });

  // 'v1/bom-request/inventory-items/:bomRequest/:inventoryID - Delete Inventory Item from BOM Request and Database
  api.delete('/inventory-items/:bomRequest/:id', authenticate, (req, res) => {
    BomRequest.findOneAndUpdate({_id: req.params.bomRequest, requestor: req.body.requestor,
        inventoryItems: req.params.id}, {$pull: {inventoryItems: req.params.id}}, (err, bomRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          BomRequest.findByIdAndUpdate(req.params.bomRequest, {$pull: {inventoryItems: req.params.id}}, (err, bomRequest) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.findByIdAndRemove(req.params.id, (err, inventoryItem) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Inventory item delented and removed from BOM Request by admin'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.findByIdAndRemove(req.params.id, (err, inventoryItem) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Inventory Item deleted and removed from BOM Request'});
          } 
        });
      }
    });
  });

  // 'v1/bom-request/:id - Delete BOM Request
  api.delete('/:id', authenticate, (req, res) => {
    BomRequest.findOneAndRemove({_id: req.params.id, requestor: req.params.requestor}, (err, bomRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          BomRequest.findByIdAndRemove(req.params.id, (err, bomRequest) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.remove({bomRequest: req.params.id}, (err, inventoryItems) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'BOM request and subcomponents deleted by admin'});
                }
              });              
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.remove({bomRequest: req.params.id}, (err, inventoryItems) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'BOM request and subcomponents deleted'});
          }
        });     
      }
    });
  });

  // 'v1/bom-request' - Read
  api.get('/', authenticate, (req, res) => {
    BomRequest.find({}, (err, bomRequests) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(bomRequests);
    });
  });
  
  return api;
}