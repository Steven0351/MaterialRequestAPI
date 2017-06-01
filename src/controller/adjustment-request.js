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
            } else if (req.body.requestor != adjustmentRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
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
                    adjustmentRequest.itemsToAdjust.push(newItemToAdjust);
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

    api.put('/:id', authenticate, (req, res) => {
        AdjustmentRequest.findById(req.params.id, (err, adjustmentRequest) => {
            if (err) {
                res.status(500).send(err);
            } else if (req.body.requestor != adjustmentRequest.requestor || req.body.requestor != '5920befd422aeb963bf0fee0') {
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

    return api;
}