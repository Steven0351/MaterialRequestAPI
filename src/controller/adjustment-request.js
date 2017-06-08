import mongoose from 'mongoose';
import { Router } from 'express';
import { authenticate } from '../middleware/auth-middleware';
import AdjustmentRequest from '../model/adjustment-request';
import InventoryItem from '../model/inventory-item';

let today = new Date();

export default({ config, db }) => {
	let api = Router();

	// '/v1/adjustment-request/add' - Create New Request
	api.post('/add', authenticate, (req, res) => {
		let newAdjustmentRequest = new AdjustmentRequest();
		newAdjustmentRequest.reason = req.body.reason;
		newAdjustmentRequest.requestor = req.body.requestor;
		newAdjustmentRequest.dateRequested = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;
		newAdjustmentRequest.save((err) => {
				if (err) {
					res.status(500).send(err);
				}
				res.status(201).json({message: 'New Adjustment Request successfully created'});
		});
	});

	// 'v1/adjustment-request/inventory-items/add/:id' - Create new item to adjust to add to request
	api.post('/inventory-items/add/:id', authenticate, (req, res) => {
		AdjustmentRequest.findById(req.params.id, (err, adjustmentRequest) => {
			if (err) {
				res.status(500).send(err);
			} else if (req.body.requestor != adjustmentRequest.requestor || req.body.role != 'admin') {
				res.status(403).json({message: 'You do not have permission to edit this Adjustment Request'});
			} else {
				let newItemToAdjust = new InventoryItem();
				newItemToAdjust.inventoryID = req.body.inventoryID;
				newItemToAdjust.quantity = req.body.quantity;
				newItemToAdjust.adjustmentRequest = adjustmentRequest._id;
				newItemToAdjust.save((err) => {
					if (err) {
						res.status(500).send(err);
					}
					adjustmentRequest.inventoryItems.push(newItemToAdjust);
					adjustmentRequest.save((err) => {
						if (err) {
							res.status(500).send(err);
						}
						res.status(200).json({message: 'Inventory Item successfully added to Adjustment Request'});
					});
				});
			}
		});
	});

	// 'v1/adjustment-request/:id' - Update AdjustmentRequest reason
	api.put('/:id', authenticate, (req, res) => {
		AdjustmentRequest.findById(req.params.id, (err, adjustmentRequest) => {
			if (err) {
				res.status(500).send(err);
			} else if (req.body.requestor != adjustmentRequest.requestor || req.body.role != 'admin') {
				res.status(403).json({message: 'You do not have permission to edit this Adjustment Request'});
			} else {
				adjustmentRequest.reason = req.body.reason;
				adjustmentRequest.save((err) => {
					if (err) {
						res.status(500).send(err);
					}
					res.status(200).json({message: 'Adjustment Request successfully updated'});
				});
			}
		});
	});

	// 'v1/adjustment-request/inventory-items/:adjustmentRequest/:id' - Update Item to Adjust in Adjustment Request
	api.put('/inventory-items/:adjustmentRequest/:id', authenticate, (req, res) => {
		AdjustmentRequest.findById(req.params.id, (err, adjustmentRequest) => {
			if (err) {
				res.status(500).send(err);
			} else if (req.body.requestor != adjustmentRequest.requestor || req.body.role != 'admin') {
				res.status(403).json({message: 'You do not have permission to edit this Adjustment Request'});
			} else {
				InventoryItem.findById(req.params.id, (err, itemToAdjust) => {
					if (err) {
						res.status(500).send(err);
					}
					itemToAdjust.inventoryID = req.body.inventoryID;
					itemToAdjust.quantity = req.body.quantity;
					itemToAdjust.save((err) => {
						if (err) {
							res.status(500).send(err);
						}
						res.status(200).json({message: 'Item to adjust successfully updated'});
					});
				});
			}
		});
	});

	// 'v1/adjustment-request/inventory-items/:adjustmentRequest/:id' - Delete itemToAdjust
	api.delete('/inventory-items/:adjustmentRequest/:id', authenticate, (req, res) => {
		AdjustmentRequest.findById(req.params.adjustmentRequest, (err, adjustmentRequest) => {
			if (err) {
				res.status(500).send(err);
			} else if (req.body.requestor != adjustmentRequest.requestor || req.body.role != 'admin') {
				res.status(403).json({message: 'You do not have permission to edit this Adjustment Request'});
			} else {
				InventoryItem.findByIdAndRemove(req.params.id, (err, itemToAdjust) => {
					if (err) {
						res.status(500).send(err);
					}
					AdjustmentRequest.findByIdAndUpdate(req.params.adjustmentRequest, {$pull: {itemsToAdjust: req.params.id}},
						(err, adjustmentRequest) => {
							if (err) {
								res.status(500).send(err);
							}
							res.status(200).json({message: 'Item to adjust successfully removed from Adjustment Request'});
						});
				});
			}
		});
	});

	// 'v1/adjustment-request/:id' - Delete Adjustment Request
	api.delete('/:id', authenticate, (req, res) => {
		AdjustmentRequest.findById(req.params.id, (err, adjustmentRequest) => {
			if (err) {
				res.status(500).send(err);
			} else if (req.body.requestor != adjustmentRequest.requestor || req.body.role != 'admin') {
				res.status(403).json({message: 'You do not have permission to edit this Adjustment Request'});
			} else {
				adjustmentRequest.remove((err) => {
					if (err) {
						res.status(500).send(err);
					}
					InventoryItem.remove({adjustmentRequest: req.params.id}, (err, itemsToAdjust) => {
						if (err) {
							res.status(500).send(err);
						}
						res.status(200).json({message: 'Adjustment Request and itemsToAdjust deleted', itemsToAdjust});
					});
				});
			}
		});
	});

	// 'v1/adjustment-request/' - Read all adjustment requests
	api.get('/', authenticate, (req, res) => {
		AdjustmentRequest.find({}, (err, adjustmentRequests) => {
		if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(adjustmentRequests);
		});
	});
	
	return api;
}