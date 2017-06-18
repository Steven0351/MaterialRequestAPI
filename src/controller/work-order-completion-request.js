import mongoose from 'mongoose';
import { Router } from 'express';
import WorkOrderCompletionRequest from '../schemas/work-order-completion-request';
import InventoryItem from '../schemas/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();

  // 'v1/work-order-completion-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newWorkOrderCompletionRequest = new WorkOrderCompletionRequest();
    newWorkOrderCompletionRequest.workOrdersToComplete = req.body.workOrdersToComplete;
    newWorkOrderCompletionRequest.requestor = req.body.requestor;
    newWorkOrderCompletionRequest.dateRequested = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;
    newWorkOrderCompletionRequest.save((err) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(201).json({message: 'Work Order Completion Request successfully saved'});
    });
  });

  // 'v1/work-order-completion-request/:id - Update Work Orders to complete
  api.put('/:id', authenticate, (req, res) => {
    WorkOrderCompletionRequest.findById(req.params.id, (err, WorkOrderCompletionRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != workOrderCompletionRequest.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        workOrderCompletionRequest.workOrdersToComplete = req.body.workOrdersToComplete;
        workOrderCompletionRequest.save((err) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).json({message: 'Work Order Completion Request successfully changed'});
        });
      }
    });
  });

  // 'v1/work-order-completion-request/:id - Delete
  api.delete('/:id', authenticate, (req, res) => {
    WorkOrderCompletionRequest.findById(req.params.id, (err, workOrderCompletionRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != workOrderCompletionRequest.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        workOrderCompletionRequest.remove((err) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).json({message: 'Work Order Completion Request successfully deleted'});
        });
      }
    });
  });

  // v1/work-order-completion-request - Read all 
  api.get('/', authenticate, (req, res) => {
    WorkOrderCompletionRequest.find({}, (err, workOrderCompletionRequests) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(workOrderCompletionRequests);
    });
  });

  return api;
}