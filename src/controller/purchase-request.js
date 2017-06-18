import mongoose from 'mongoose';
import { Router } from 'express';
import PurchaseRequest from '../model/purchase-request';
import InventoryItem from '../model/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();

// '/v1/purchase-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newPurchaseRequest = new PurchaseRequest();
    newPurchaseRequest.shippingMethod = req.body.shippingMethod;
    newPurchaseRequest.isHot = req.body.isHot || false;
    newPurchaseRequest.isDropShip = req.body.isHot || false;
    purchaseRequest.orderHasBeenPlaced = req.body.orderHasBeenPlaced || false;
    purchaseRequest.orderAcknowledgementReceived = req.body.orderAcknowledgementReceived || false;
    purchaseRequest.trackingInformation = req.body.trackingInformation || 'No tracking available';
    newPurchaseRequest.requestor = req.body.requestor;
    newPurchaseRequest.dateRequested = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;

    newPurchaseRequest.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({ message: 'Purchase Request saved successfully'});
      }
    });
  });

  // 'v1/purchase-request/inventory-items/add/:id - Add inventory items 
  api.post('/inventory-items/add/:id', authenticate, (req, res) => {
    PurchaseRequest.findById(req.params.id, (err, purchaseRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != purchaseRequest.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        let itemToPurchase = new InventoryItem();
        itemToPurchase.inventoryID = req.body.inventoryID;
        itemToPurchase.quantity = req.body.quantity;
        itemToPurchase.purchaseRequest = purchaseRequest._id;
        itemToPurchase.save((err) => {
          if (err) {
            res.status(500).send(err);
          }
          purchaseRequest.inventoryItems.push(itemToPurchase);
          purchaseRequest.save((err) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(201).json({message: 'Inventory Item successfully added to purchase request'});
          });
        });
      }
    });
  });

  // 'v1/purchase-request/:id - Update purchase request
  api.put('/:id', authenticate, (req, res) => {
    PurchaseRequest.findOne({'_id': req.params.id, 'requestor': req.body.requestor}, (err, purchaseRequest) => {
      if (err) {
        res.status(500).send(err);
     /* } else if (req.body.requestor != purchaseRequest.requestor._id.toString() || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request ' + purchaseRequest.requestor._id.toString()});
        return; */
      } else {
        purchaseRequest.shippingMethod = req.body.shippingMethod;
        purchaseRequest.isHot = req.body.isHot;
        purchaseRequest.isDropShip = req.body.isDropShip;
        purchaseRequest.orderHasBeenPlaced = req.body.orderHasBeenPlaced;
        purchaseRequest.orderAcknowledgementReceived = req.body.orderAcknowledgementReceived;
        purchaseRequest.trackingInformation = req.body.trackingInformation;
        purchaseRequest.save((err) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).json({message: 'Purchase request successfully updated'});
        });
      }
    });
  });
  
  // 'v1/purchase-request/:id/:inventoryItem - Update purchase request line item
  api.put('/inventory-items/:purchaseRequest/:inventoryItem', authenticate, (req, res) => {
    PurchaseRequest.findById(req.params.purchaseRequest, (err, purchaseRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != purchaseRequest.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
        return;
      } else {
        InventoryItem.findById(req.params.inventoryItem, (err, lineItem) => {
          lineItem.inventoryID = req.body.inventoryID;
          lineItem.quantity = req.body.quantity;
          lineItem.save((err) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(200).json({message: 'Line item successfully updated'})
          });
        });
      }
    });
  });

// 'v1/purchase-request/:id' - Delete purchase request
  api.delete('/:id', authenticate, (req, res) => {
    PurchaseRequest.findById(req.params.id, (err, purchaseRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (purchaseRequest == null) {
        res.status(404).send('Purchase request not found');
      } else if (req.body.requestor != purchaseRequest.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to delete this request'});
      } else {
        PurchaseRequest.remove({_id: req.params.id}, (err, purchaseRequest) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          InventoryItem.remove({purchaseRequest: req.params.id}, (err, inventoryItem) => {
            if (err) {
              res.status(500).send(err);
            }
            res.status(200).json({message: 'Purchase request successfully deleted'});
          });
        });
      }
    });
  });

  // 'v1/purchase-request/:id/:lineItem' - Delete purchase order line item
  api.delete('/:id/:lineItem', authenticate, (req, res) => {
    PurchaseRequest.findById(req.params.id, (err, purchaseRequest) => {
      if (err) {
        res.status(500).send(err);
      } else if (req.body.requestor != purchaseRequest.requestor || req.body.role != 'admin') {
        res.status(403).json({message: 'You do not have permission to edit this request'});
      } else {
        InventoryItem.findByIdAndRemove(req.params.lineItem, (err, inventoryItem) => {
          if (err) {
            res.status(500).send(err);
          }
          PurchaseRequest.findByIdAndUpdate(req.params.id, {$pull: {inventoryItems: req.params.lineItem}}, (err, purchaseRequest) => {
            if (err) {
              res.status(500).send(err)
            }
            res.status(200).json({message: 'Line item deleted and removed from purchase request'});
          });
        });
      }
    });
  });

  // 'v1/purchase-request - get all purchase requests - Read
  api.get('/', authenticate, (req, res) => {
    PurchaseRequest.find({},(err, purchaseRequests) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(purchaseRequests);
      });
    });

    // 'v1/purchase-request/isHot/:isHot - get all purchase requests matching input boolean - Read
    api.get('/isHot/:isHot', authenticate, (req, res) => {
      PurchaseRequest.find({'isHot': req.params.isHot}, (err, purchaseRequests) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).json(purchaseRequests);
      });
    });

    // 'v1/purchase-request/orderHasBeenPlaced/:orderHasBeenPlaced' - get all purchase requests matching input boolean - Read
    api.get('/orderHasBeenPlaced/:orderHasBeenPlaced', authenticate, (req, res) => {
      PurchaseRequest.find({'orderHasBeenPlaced': req.params.orderHasBeenPlaced}, (err, purchaseRequests) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).json(purchaseRequests);
      });
    });

    // 'v1/purchase-request/requestor/:requestor' - get all purchase requests for specific requestor - Read
    api.get('/requestor/:requestor', authenticate, (req, res) => {
      PurchaseRequest.find({'requestor': req.params.requestor}, (err, purchaseRequests) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).json(purchaseRequests);
      });
    });

  return api;
}