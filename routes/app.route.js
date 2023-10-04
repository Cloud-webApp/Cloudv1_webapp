// import Router from 'express';
// import validator from 'lodash';

// const router= Router();

// router.get('/',(req,res)=>{
//     if(!validator.isEmpty(req.body) || !validator.isEmpty(req.query)){
//         return res.status(400).json(); 
//     };
//     res.send()
// })

// export default router;

import db from "../models/index.js";

const checkHealth = async (req, res) => {
  const length = req.headers['content-length'];
  if ((req.method === 'GET' && length > 0) || req.url.includes('?')) {
    res.status(400).send();
  } else {
    try {
      await db.sequelize.authenticate();
      res.set('Cache-control', 'no-cache');
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(503).send();
    }
  }
};

export default checkHealth;