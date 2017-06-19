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
    let newWorkOrderCompletionRequest = new WorkOrderCompletionRequest({
      workOrdersToComplete: req.body.workOrdersToComplete,
      requestor: req.body.requestor,
      dateRequested: `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
    });
    newWorkOrderCompletionRequest.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({message: 'Work Order Completion Request successfully saved'});
      }
    });
  });

  // 'v1/work-order-completion-request/:id - Update Work Orders to complete
  api.put('/:id', authenticate, (req, res) => {
    WorkOrderCompletionRequest.findOneAndUpdate({_id: req.params.id, requestor: req.body.requestor},
        {$set: {workOrdersToComplete: req.body.workOrdersToComplete}}, (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          WorkOrderCompletionRequest.findByIdAndUpdate(req.params.id, {$set: {
              workOrdersToComplete: req.body.workOrdersToComplete}}, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Work Order Completion updated by admin'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        res.status(200).json({message: 'Work Order Completion Request successfully changed'});
      }
    });
  });

  // 'v1/work-order-completion-request/:id - Delete
  api.delete('/:id', authenticate, (req, res) => {
    WorkOrderCompletionRequest.findOneAndRemove({_id: req.params.id, requestor: req.body.requestor},
        (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          WorkOrderCompletionRequest.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Work Order Completion deleted by admin'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else if (req.body.requestor != workOrderCompletionRequest.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        res.status(200).json({message: 'Work Order Completion Request successfully deleted'});
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