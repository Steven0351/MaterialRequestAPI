import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
// Still need to add source file imports for controller files
import bomrequest from '';
import creatematerialrequest from '';
import cyclecountrequest from '';
import materialissuerequest from '';
import purchaserequest from '';
import user from '';


let router = express();

// connect to database
initializeDb(db => {

  // internal middleware
  router.use(middleware({ config, db }));
  // api routes v1 
  router.use('/bom-request', bomrequest({ config, db }));
  router.use('/create-material-request', creatematerialrequest({ config, db }));
  router.use('/cycle-count-request', cyclecountrequest({ config, db }));
  router.use('/material-issue-request', materialissuerequest({ config, db }));
  router.use('/purchase-request', purchaserequest({ config, db }));
  router.use('/user', user({ config, db }));
});

export default router;