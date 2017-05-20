import mongoose from 'mongoose';
import { Router } from 'express';
import PurchaseRequest from '../model/purchase-request';
import { authentitcate } from '../middleware/auth-middleware';

export default({ config, db }) => {
  let api = Router();

// '/v1/purchase-request/add - Create
  api.post('/add', authentitcate, (req, res) => {
    let newPurchaseRequest = new PurchaseRequest();
    newPurchaseRequest.inventoryID = req.body.inventoryID;
    newPurchaseRequest.quantity = req.body.quantity;
    newPurchaseRequest.shippingMethod = req.body.shippingMethod;
    newPurchaseRequest.requestor = req.body.requestor;

    newPurchaseRequest.save(err => {
      if (err) {
        res.send(err);
        }
        res.json({ message: 'Purchase Request saved successfully'});
    });
  });

  // 'v1/purchase-request - Read
  api.get('/', authentitcate, (req, res) => {
    PurchaseRequest.find({},(err, purchaseRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(purchaseRequests);
      });
    });

    return api;
}