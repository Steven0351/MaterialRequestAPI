import mongoose from 'mongoose';
import { Router } from 'express';
import CycleCountRequest from '../schemas/cycle-count-request';
import InventoryItem from '../schemas/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();

  // 'v1/cycle-count-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newCycleCountRequest = new CycleCountRequest({
      requestor: req.body.requestor,
      dateRequested: `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
    });
    newCycleCountRequest.save(err => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({message: "Cycle Count Request successfully created"});
      }
    });
  });

  // 'v1/cycle-count-request/inventory-items/add/:id - Add cycle count items 
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
    CycleCountRequest.findOne({_id: req.params.id, requestor: req.body.requestor}, (err, cycleCountRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          let newCountRequest = new InventoryItem();
          newCountRequest.inventoryID = req.body.inventoryID;
          newCountRequest.binLocations = req.body.binLocations;
          newCountRequest.cycleCountRequest = cycleCountRequest._id;
          newCountRequest.save((err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              cycleCountRequest.inventoryItems.push(newCountRequest);
              cycleCountRequest.save((err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(201).json({message: 'Inventory Item successfully added to cycle count request'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        let newCountRequest = new InventoryItem();
        newCountRequest.inventoryID = req.body.inventoryID;
        newCountRequest.binLocations = req.body.binLocations;
        newCountRequest.cycleCountRequest = cycleCountRequest._id;
        newCountRequest.save((err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            cycleCountRequest.inventoryItems.push(newCountRequest);
            cycleCountRequest.save((err) => {
              if (err) {
                res.status(500).send(err);
              }
              res.status(201).json({message: 'Inventory Item successfully added to cycle count request'});
            });
          }
        });
      }  
    });
  });

  // 'v1/cycle-count-request/inventory-items/:id/:inventoryItem - Edit cycle count item
  api.put('/inventory-items/:id/:inventoryItem', authenticate, (req, res) => {
    CycleCountRequest.findOne({_id: req.params.id, requestor: req.body.requestor}, (err, cycleCountRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          InventoryItem.findByIdAndUpdate(req.params.inventoryItem, {$set: 
              {inventoryID: req.body.inventoryID, binLocations: req.body.binLocations}}, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Inventory Item successfully edited by admin'});
            }
          });
        }
      } else {
        InventoryItem.findByIdAndUpdate(req.params.inventoryItem, {$set: 
            {inventoryID: req.body.inventoryID, binLocations: req.body.binLocations}}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Inventory Item successfully edited'});
          }
        });
      }
    });
  });

  // 'v1/cycle-count-request/:id - Delete Cycle Count Request and Corresponding inventory items
  api.delete('/:id', authenticate, (req, res) => {
    CycleCountRequest.findOneAndRemove({_id: req.params.id, requestor: req.body.requestor}, (err, cycleCountRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          CycleCountRequest.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.remove({cycleCountRequest: req.params.id}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Cycle Count requeste deleted by admin'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.remove({cycleCountRequest: req.params.id}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Cycle Count request deleted'});
          }
        });
      }
    });
  });

  // 'v1/cycle-count-request/inventory-items/:cycleCount/:id - Delete Inventory Item from cycle count request
  api.delete('/inventory-items/:cycleCount/:id', authenticate, (req, res) => {
    CycleCountRequest.findOneAndUpdate({_id: req.params.cycleCount, requestor: req.body.requestor}, 
        {$pull: {inventoryItems: req.params.id}}, (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          CycleCountRequest.findByIdAndUpdate(req.params.cycleCount, {$pull: {inventoryItems: req.params.id}},
              (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.findByIdAndRemove(req.params.id, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Inventory Item deleted by admin'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Inventory item successfully deleted and removed from Cycle Count Request'});
          }
        });
      }
    });
  });

  // 'v1/cycle-count-request - Read
  api.get('/', authenticate, (req, res) => {
    CycleCountRequest.find({}, (err, cycleCountRequests) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(cycleCountRequests);
    });
  });

  return api;
}