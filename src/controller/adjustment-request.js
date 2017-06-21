import mongoose from 'mongoose';
import { Router } from 'express';
import { authenticate } from '../middleware/auth-middleware';
import AdjustmentRequest from '../schemas/adjustment-request';
import InventoryItem from '../schemas/inventory-item';

let today = new Date();

export default({ config, db }) => {
	let api = Router();

	// '/v1/adjustment-request/add' - Create New Request
	api.post('/add', authenticate, (req, res) => {
		let newAdjustmentRequest = new AdjustmentRequest({
      reason: req.body.reason,
      requestor: req.body.requestor,
      dateRequested: `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
    });
		newAdjustmentRequest.save((err) => {
				if (err) {
					res.status(500).send(err);
				} else {
          res.status(201).json({message: 'New Adjustment Request successfully created'});
        }
		});
	});

	// 'v1/adjustment-request/add/:id' - Create new item to adjust to add to request
	api.post('/add/:id', authenticate, (req, res) => {
		AdjustmentRequest.findOne({_id: req.params.id, requestor: req.body.requestor},
        (err, adjustmentRequest) => {
			if (err) {
				if (req.body.role == 'admin') {
          AdjustmentRequest.findById(req.params.id, (err, adjustmentRequest) => {
            let newItemToAdjust = new InventoryItem({
              inventoryID: req.body.inventoryID,
              quantity: req.body.quantity,
              adjustmentRequest: adjustmentRequest._id
            });
            newItemToAdjust.save((err) => {
              if (err) {
                res.status(500).send(err);
              }
              adjustmentRequest.inventoryItems.push(newItemToAdjust);
              adjustmentRequest.save((err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Inventory Item successfully added to Adjustment Request by Admin'});
                }
              });
            });
          });
        } else {
          res.status(404).json({error: err});
        }
			} else {
				let newItemToAdjust = new InventoryItem({
          inventoryID: req.body.inventoryID,
          quantity: req.body.quantity,
          adjustmentRequest: adjustmentRequest._id
        });
				newItemToAdjust.save((err) => {
					if (err) {
						res.status(500).send(err);
					} else {
            adjustmentRequest.inventoryItems.push(newItemToAdjust);
            adjustmentRequest.save((err) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).json({message: 'Inventory Item successfully added to Adjustment Request'});
              }
            });
          }
				});
			}
		});
	});

	// 'v1/adjustment-request/:id' - Update AdjustmentRequest reason
	api.put('/:id', authenticate, (req, res) => {
		AdjustmentRequest.findOneAndUpdate({_id: req.params.id, requestor: req.params.requestor},
        {$set: {reason: req.body.reason}}, (err) => {
			if (err) {
				if (req.body.role == 'admin') {
          AdjustmentRequest.findByIdAndUpdate(req.params.id, {$set: {reason: req.params.reason}}, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Adjustment request successfully updated'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
			} else {
				res.status(200).json({message: 'Adjustment Request successfully updated'});
      }
		});
	});

	// 'v1/adjustment-request/:adjustmentRequest/:id' - Update Item to Adjust in Adjustment Request
	api.put('/:adjustmentRequest/:id', authenticate, (req, res) => {
		AdjustmentRequest.findOne({_id: req.params.adjustmentRequest, requestor: req.body.requestor},
        (err) => {
			if (err) {
				if (req.body.role == 'admin') {
          InventoryItem.findByIdAndUpdate(req.params.id, {$set: {inventoryID: req.body.inventoryID,
              quantity: req.body.quantity}}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Item to adjust successfully updated by admin'});
                }
          });
        } else {
          res.status(404).json({error: err});
        }
			} else {
				InventoryItem.findByIdAndUpdate(req.params.id, {$set: {inventoryID: req.body.inventoryID,
              quantity: req.body.quantity}}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Item to adjust successfully updated by admin'});
                }
        });
			}
		});
	});

	// 'v1/adjustment-request/inventory-items/:adjustmentRequest/:id' - Delete itemToAdjust
	api.delete('/:adjustmentRequest/:id', authenticate, (req, res) => {
		AdjustmentRequest.findOneAndUpdate({_id: req.params.adjustmentRequest, requestor: req.body.requestor},
        {$pull: {inventoryItems: req.params.id}}, (err) => {
			if (err) {
				if (req.body.role == 'admin') {
          AdjustmentRequest.findByIdAndUpdate(req.params.adjustmentRequest, {$pull: {inventoryItems: req.params.id}},
              (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.findByIdAndRemove(req.params.id, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Inventory item successfully deleted from adjustment request by admin'});
                }
              });
            }
          });
        }
			} else {
				InventoryItem.findByIdAndRemove(req.params.id, (err) => {
					if (err) {
						res.status(500).send(err);
					} else {
            res.status(200).json({message: 'Inventory item successfully deleted from adjustment request'})
          }
				});
			}
		});
	});

	// 'v1/adjustment-request/:id' - Delete Adjustment Request
	api.delete('/:id', authenticate, (req, res) => {
		AdjustmentRequest.findOneAndRemove({_id: req.params.id, requestor: req.body.requestor},
        (err) => {
			if (err) {
				if (req.body.role == 'admin') {
          AdjustmentRequest.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Adjustment request successfully deleted by admin'});
            }
          });
        }
			} else {
				res.status(200).json({message: 'Adjustment Request and itemsToAdjust deleted', itemsToAdjust});
      }
    });
  });

	// 'v1/adjustment-request/' - Read all adjustment requests
	api.get('/', authenticate, (req, res) => {
		AdjustmentRequest.find({}, (err, adjustmentRequests) => {
		if (err) {
				res.status(500).send(err);
			} else {
        res.status(200).json(adjustmentRequests);
      }
		});
	});
	
	return api;
}