import mongoose from 'mongoose';
import { Router } from 'express';
import PurchaseRequest from '../model/purchase-request';
import InventoryItem from '../model/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

export default({ config, db }) => {
  let api = Router();

// '/v1/purchase-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newPurchaseRequest = new PurchaseRequest();
    newPurchaseRequest.itemsToBePurchased = req.body.itemsToBePurchased;
    newPurchaseRequest.shippingMethod = req.body.shippingMethod;
    newPurchaseRequest.requestor = req.body.requestor;

    newPurchaseRequest.save(err => {
      if (err) {
        res.send(err);
        }
        res.json({ message: 'Purchase Request saved successfully'});
    });
  });

  // 'v1/purchase-request/inventory-items/add/:id - Add inventory items 
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
    PurchaseRequest.findById(req.params.id, (err, purchaseRequest) => {
      if (err) {
        res.send(err);
      }
      let itemToPurchase = new InventoryItem();

      itemToPurchase.inventoryID = req.body.inventoryID;
      itemToPurchase.quantity = req.body.quantity;
      itemToPurchase.purchaseRequest = purchaseRequest._id;
      itemToPurchase.save((err, toPurchase) => {
        if (err) {
          res.send(err);
        }
        purchaseRequest.itemsToBePurchased.push(itemToPurchase);
        purchaseRequest.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json({message: 'Inventory Item successfully added to purchase request'});
        });
      });
    });
  });

  // 'v1/purchase-request - Read
  api.get('/', authenticate, (req, res) => {
    PurchaseRequest.find({},(err, purchaseRequests) => {
      if (err) {
        res.send(err);
      }
      res.json(purchaseRequests);
      });
    });

    return api;
}