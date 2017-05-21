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
    newCycleCountRequest.countRequests = req.body.countRequests;
    newCycleCountRequest.requestor = req.body.requestor;

    newCycleCountRequest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: "Cycle Count Request successfully saved"});
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


  // 'v1/cycle-count-request/inventory-items/add/:id - Add cycle count items 
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
    CycleCountRequest.findById(req.params.id, (err, cycleCountRequest) => {
      if (err) {
        res.send(err);
      }
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
    });
  });

  return api;
}