import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
// Still need to add source file imports for controller files
import adjustmentrequest from '../controller/adjustment-request';
import bomrequest from '../controller/bom-request';
import creatematerialrequest from '../controller/create-material-request';
import cyclecountrequest from '../controller/cycle-count-request';
import materialissuerequest from '../controller/material-issue-request';
import purchaserequest from '../controller/purchase-request';
import receivingissue from '../controller/receiving-issue'
import user from '../controller/user';
import userinformation from '../controller/user-information'
import workordercompletionrequest from '../controller/work-order-completion-request';


let router = express();

// connect to database
initializeDb(db => {

  // internal middleware
  router.use(middleware({ config, db }));
  // api routes v1 
  router.use('/adjustment-request', adjustmentrequest({ config, db}));
  router.use('/bom-request', bomrequest({ config, db }));
  router.use('/create-material-request', creatematerialrequest({ config, db }));
  router.use('/cycle-count-request', cyclecountrequest({ config, db }));
  router.use('/material-issue-request', materialissuerequest({ config, db }));
  router.use('/purchase-request', purchaserequest({ config, db }));
  router.use('/receiving-issue', receivingissue({ config, db }));
  router.use('/user', user({ config, db }));
  router.use('/user-information', userinformation({ config, db }));
  router.use('/work-order-completion-request', workordercompletionrequest({ config, db}));
});

export default router;