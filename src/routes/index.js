import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import purchaserequest from '';
import user from '';

let router = express();

// connect to database
initializeDb(db => {

  // internal middleware
  router.use(middleware({ config, db }));
  // api routes v1 
  router.use('/purchaserequest', purchaserequest({ config, db }));
  router.use('/user', user({ config, db }));
});

export default router;