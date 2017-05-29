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
        res.send(err);
      }
      res.json({message: 'New BOM Request successfully saved'});
    });
  });

  // 'v1/bom-request/inventory-items/add/:id - add subcomponents to BomRequest 
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
    BomRequest.findById(req.params.id, (err, bomRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != bomRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this BOM Request'});
      } else {
        let newSubcomponent = new InventoryItem();
        newSubcomponent.inventoryID = req.body.inventoryID;
        newSubcomponent.quantity = req.body.quantity;
        newSubcomponent.bomRequest = bomRequest._id;
        newSubcomponent.save((err, bomRequestSuccess) => {
          if (err) {
            res.send(err);
          }
          bomRequest.subcomponents.push(newSubcomponent);
          bomRequest.save((err) => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'Inventory Item successfully added to BOM request'});
          });
        });
      }
    });
  });

  api.put('/:id', authenticate, (req, res) => {
    BomRequest.findById(req.params.id, (err, bomRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != bomRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this request'});
      } else {
        bomRequest.proposedTopLevelID = req.body.proposedTopLevelID;
        bomRequest.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json({message: 'BOM Request Successfully Updated'});
        });
      }
    });
  });

  // 'v1/bom-request/inventory-items/:bomRequest/:inventoryID - Update Inventory Item
  api.put('/inventory-items/:bomRequest/:id', authenticate, (req, res) => {
    BomRequest.findById(req.params.bomRequest, (err, bomRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != bomRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this request'});
      } else {
        InventoryItem.find({bomRequest: req.params.bomRequest}, (err, invetoryItems) => {
          if (err) {
            res.send(err);
          }
          InventoryItem.findById(req.params.id, (err, inventoryItem) => {
            if (err) {
              res.send(err);
            }
            inventoryItem.inventoryID = req.body.inventoryID;
            inventoryItem.quantity = req.body.quantity;
            inventoryItem.save((err) => {
              if (err) {
                res.send(err);
              }
              res.json({message: 'Inventory Item successfully updated'});
            });
          });
        });
      }
    });
  });

  // 'v1/bom-request/inventory-items/:bomRequest/:inventoryID - Delete Inventory Item from BOM Request and Database
  api.delete('/inventory-items/:bomRequest/:id', authenticate, (req, res) => {
    BomRequest.findById(req.params.bomRequest, (err, bomRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != bomRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this request'});
      } else {
        InventoryItem.findByIdAndRemove(req.params.id, (err, inventoryItem) => {
          if (err) {
            res.send(err);
          }
          BomRequest.findOneAndUpdate({_id: req.params.bomRequest}, {$pull: {subcomponents: req.params.id}}, (err, bomRequest) => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'Inventory Item deleted and removed from BOM Request'});
          });
        });
      }
    });
  });

  // 'v1/bom-request/:id - Delete BOM Request
  api.delete('/:id', authenticate, (req, res) => {
    BomRequest.findById(req.params.id, (err, bomRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != bomRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this request'});
      } else {
        bomRequest.remove((err) => {
          if (err) {
            res.send(err);
          }
          InventoryItem.remove({bomRequest: req.params.id}, (err, success) => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'BOM Request and subcomponents deleted from inventory-items DB'});
          });
        });
      }
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
  
  return api;
}