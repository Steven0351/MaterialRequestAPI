import mongoose from 'mongoose';
import { Router } from 'express';
import PurchaseRequest from '../schemas/purchase-request';
import InventoryItem from '../schemas/inventory-item';
import { authenticate } from '../middleware/auth-middleware';

let today = new Date();

export default({ config, db }) => {
  let api = Router();

// '/v1/purchase-request/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newPurchaseRequest = new PurchaseRequest({
      shippingMethod: req.body.shippingMethod,
      hot: req.body.hot || false,
      dropShip: req.body.dropShip || false,
      placed: req.body.placed || false,
      acknowledgementReceived: req.body.acknowledgementReceived || false,
      trackingInformation: req.body.trackingInformation || 'No tracking available',
      requestor: req.body.requestor,
      dateRequested: `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
    });
    
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
    PurchaseRequest.findOne({_id: req.params.id, requestor: req.body.requestor}, (err, purchaseRequest) => {
      if (err) {
        if (req.body.role == 'admin') {
          PurchaseRequest.findById(req.params.id, (err, purchaseRequest) => {
            let itemToPurchase = new InventoryItem({
              inventoryID: req.body.inventoryID,
              quantity: req.body.quantity,
              purchaseRequest: purchaseRequest._id
            });
            itemToPurchase.save((err) => {
              if (err) {
                res.status(500).send(err);
              } else {
                purchaseRequest.inventoryItems.push(itemToPurchase);
                purchaseRequest.save((err) => {
                  if (err) {
                    res.status(500).send(err);
                  } else {
                    res.status(200).json({message: 'Item added to purchase request by admin'});
                  }
                });
              }
            });
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        let itemToPurchase = new InventoryItem({
          inventoryID: req.body.inventoryID,
          quantity: req.body.quantity,
          purchaseRequest: purchaseRequest._id
        });
        itemToPurchase.save((err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            purchaseRequest.inventoryItems.push(itemToPurchase);
            purchaseRequest.save((err) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(201).json({message: 'Inventory Item successfully added to purchase request'});
              }
            });
          }
        });
      }
    });
  });

  // 'v1/purchase-request/:id - Update purchase request
  api.put('/:id', authenticate, (req, res) => {
    PurchaseRequest.findOneAndUpdate({_id: req.params.id, requestor: req.body.requestor}, {$set: {
        shippingMethod: req.body.shippingMethod,
        hot: req.body.hot,
        dropShip: req.body.dropShip,
        placed: req.body.placed,
        acknowledgementReceived: req.body.acknowledgementReceived,
        trackingInformation: req.body.trackingInformation}}, (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          PurchaseRequest.findByIdAndUpdate(req.params.id, {$set: {
              shippingMethod: req.body.shippingMethod,
              hot: req.body.hot,
              dropShip: req.body.dropShip,
              placed: req.body.placed,
              acknowledgementReceived: req.body.acknowledgementReceived,
              trackingInformation: req.body.trackingInformation}}, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).json({message: 'Purchase request updated by admin'});
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        res.status(200).json({message: 'Purchase request successfully updated'});
      }
    });
  });
  
  // 'v1/purchase-request/:id/:inventoryItem - Update purchase request line item
  api.put('/inventory-items/:purchaseRequest/:inventoryItem', authenticate, (req, res) => {
    PurchaseRequest.findOne({_id: req.params.purchaseRequest, requestor: req.body.requestor},
        (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          PurchaseRequest.findById(req.params.purchaseRequest, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.findByIdAndUpdate(req.params.inventoryItem, {$set: {
                  inventoryID: req.body.inventoryID,
                  quantity: req.body.quantity
              }}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Line item updated by admin'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.findByIdAndUpdate(req.params.inventoryItem, {$set: {
            inventoryID: req.body.inventoryID,
            quantity: req.body.quantity
        }}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Line item updated by admin'});
          }
        });
      }
    });
  });

// 'v1/purchase-request/:id' - Delete purchase request
  api.delete('/:id', authenticate, (req, res) => {
    PurchaseRequest.findOneAndRemove({_id: req.params.id, requestor: req.body.requestor}, (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          PurchaseRequest.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.remove({purchaseRequest: req.params.id}, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Purchase order request deleted by admin'});
                }
              });
            }
          });
        }
      } else {
        InventoryItem.remove({purchaseRequest: req.params.id}, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Purchase request successfully deleted'});
          }
        });
      }
    });
  });

  // 'v1/purchase-request/:id/:lineItem' - Delete purchase order line item
  api.delete('/:id/:lineItem', authenticate, (req, res) => {
    PurchaseRequest.findOneAndUpdate({_id: req.params.id, requestor: req.body.requestor}, 
        {$pull: {inventoryItems: req.params.lineItem}}, (err) => {
      if (err) {
        if (req.body.role == 'admin') {
          PurchaseRequest.findByIdAndUpdate(req.params.id, {$pull: {inventoryItems: req.params.lineItem}},
              (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              InventoryItem.findByIdAndRemove(req.params.id, (err) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).json({message: 'Line item deleted by admin'});
                }
              });
            }
          });
        } else {
          res.status(404).json({error: err});
        }
      } else {
        InventoryItem.findByIdAndRemove(req.params.lineItem, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json({message: 'Line item deleted and removed from purchase request'});
          }
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

  // 'v1/purchase-request/hot/:hot - get all purchase requests matching input boolean - Read
  api.get('/hot/:hot', authenticate, (req, res) => {
    PurchaseRequest.find({'hot': req.params.hot}, (err, purchaseRequests) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(purchaseRequests);
    });
  });

  // 'v1/purchase-request/placed/:placed' - get all purchase requests matching input boolean - Read
  api.get('/placed/:placed', authenticate, (req, res) => {
    PurchaseRequest.find({'placed': req.params.placed}, (err, purchaseRequests) => {
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