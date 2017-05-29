import mongoose from 'mongoose';
import { Router } from 'express';
import CycleCountRequest from '../model/cycle-count-request';
import InventoryItem from '../model/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

export default({ config, db}) => {
  let api = Router();

  // 'v1/cycle-count-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newCycleCountRequest = new CycleCountRequest();
    newCycleCountRequest.requestor = req.body.requestor;

    newCycleCountRequest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: "Cycle Count Request successfully saved"});
    });
  });

  // 'v1/cycle-count-request/inventory-items/add/:id - Add cycle count items 
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
    CycleCountRequest.findById(req.params.id, (err, cycleCountRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != cycleCountRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this Cycle Count Request'});
      } else {
        let newCountRequest = new InventoryItem();
        newCountRequest.inventoryID = req.body.inventoryID;
        newCountRequest.binLocations = req.body.binLocations;
        newCountRequest.cycleCountRequest = cycleCountRequest._id;
        newCountRequest.save((err, countRequest) => {
          if (err) {
            res.send(err);
          }
          cycleCountRequest.countRequests.push(newCountRequest);
          cycleCountRequest.save((err) => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'Inventory Item successfully added to cycle count request'});
          });
        });
      }
    });
  });

  // 'v1/cycle-count-request/inventory-items/:id/:inventoryItem - Edit cycle count item
  api.put('/inventory-items/:id/:inventoryItem', authenticate, (req, res) => {
    CycleCountRequest.findById(req.params.id, (err, cycleCountRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != cycleCountRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this Cycle Count Request'});
      } else {
        InventoryItem.findById(req.params.inventoryItem, (err, inventoryItem) => {
          inventoryItem.inventoryID = req.body.inventoryID;
          inventoryItem.binLocations = req.body.binLocations;
          inventoryItem.save((err) => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'Inventory Item successfully edited'});
          });
        });
      }
    });
  });

  // 'v1/cycle-count-request/:id - Delete Cycle Count Request and Corresponding inventory items
  api.delete('/:id', authenticate, (req, res) => {
    CycleCountRequest.findById(req.params.id, (err, cycleCountRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != cycleCountRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this Cycle Count Request'});
      } else {
        cycleCountRequest.remove((err) => {
          if (err) {
            res.send(err);
          }
          InventoryItem.remove({cycleCountRequest: req.params.id}, (err) => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'Cycle Count and Inventory Items deleted'});
          });
        });
      }
    });
  });

  // 'v1/cycle-count-request/inventory-items/:cycleCount/:id - Delete Inventory Item from cycle count request
  api.delete('/inventory-items/:cycleCount/:id', authenticate, (req, res) => {
    CycleCountRequest.findById(req.params.cycleCount, (err, cycleCountRequest) => {
      if (err) {
        res.send(err);
      } else if (req.body.requestor != cycleCountRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
        res.json({message: 'You do not have permission to edit this Cycle Count Request'});
      } else {
        InventoryItem.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            res.send(err);
          }
          CycleCountRequest.findByIdAndUpdate(req.params.cycleCount, {$pull: {itemsToCount: req.params.id}}, (err) => {
            if (err) {
              res.send(err)
            }
            res.json({message: 'Inventory item successfully deleted and removed from Cycle Count Request'});
          });
        });
      }
    });
  });

  // 'v1/cycle-count-request - Read
  api.get('/', authenticate, (req, res) => {
    CycleCountRequest.find({}, (err, cycleCountRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(cycleCountRequests);
    });
  });

  return api;
}