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
      }
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
    });
  });

  // 'v1/bom-request/inventory-items/:bomRequest/:inventoryID - Update Inventory Item
  api.put('/inventory-items/:bomRequest/:id', authenticate, (req, res) => {
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
  });

  // 'v1/bom-request/inventory-items/:bomRequest/:inventoryID - Delete Inventory Item
  api.delete('/inventory-items/:bomRequest/:id', authenticate, (req, res) => {
    InventoryItem.find({bomRequest: req.params.bomRequest}, (err, invetoryItems) => {
      if (err) {
        res.send(err);
      }
      InventoryItem.findById(req.params.id, (err, inventoryItem) => {
        if (err) {
          res.send(err);
        }
        InventoryItem.remove(req.params.id, (err, inventoryItem) => {
          if (err) {
            res.send(err);
          }
          res.json({message: 'Inventory Item successfully deleted'});
        });
      });
    });
    api.put(`/${req.params.bomRequest}/${req.params.id}`, (req, res) => {
      BomRequest.findById(req.params.bomRequest, (err, bomRequest) => {
        let inventoryItem = req.params.id;
        var i;
        for (i = 0; i < bomRequest.subcomponents.count; i++) {
          if (bomRequest.subcomponents[i] === inventoryItem) {
            bomRequest.subcomponents.splice(i,1);
          }
        }
      });
    });
  });

  // 'v1/bom-request/:id - Delete BOM Request
  api.delete('/:id', authenticate, (req, res) => {
    BomRequest.findById(req.params.id, (err, bomRequest) => {
      if (err) {
        res.send(err);
      }
      BomRequest.remove(req.params.id, (err, success) => {
        if (err) {
          res.send(err);
        }
        res.json({message: 'BOM Request successfully deleted'});
      });
    });
    api.delete(`/inventory-items/${req.params.id}`, (req, res) => {
      InventoryItem.find({bomRequest: req.params.id}, (err, inventoryItems) => {
        if (err) {
          res.send(err);
        }
        InventoryItem.remove(req.params.id, (err, success) => {
          if (err) {
            res.send(err);
          }
          res.json({message: 'BOM Request subcompoents deleted from inventory-items DB'});
        });
      });
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