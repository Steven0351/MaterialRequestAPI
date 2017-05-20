import mongoose from 'mongoose';
import { Router } from 'express';
import PurchaseRequest from '../model/purchase-request';
import { authenitcate } from '../middleware/auth-middleware';

export default({ config, db }) => {
  let api = Router();

// '/v1/purchaserequest/add - Create
  api.post('/add', authenitcate, (req, res) => {
    let newPurchaseRequest = new PurchaseRequest();
    newPurchaseRequest.inventoryID = req.body.inventoryID;
    newPurchaseRequest.quantity = req.body.quantity;
    newPurchaseRequest.shippingMethod = req.body.shippingMethod;

    newPurchaseRequest.save(err => {
      if (err) {
        res.send(err);
        }
        res.json({ message: 'Purchase Request saved successfully'});
      });
    });

  // 'v1/purchaserequest - Read
  api.get('/', (req, res) => {
    PurchaseRequest.find({},(err, purchaseRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(purchaseRequests);
      });
    });

}