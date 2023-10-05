import sequelize from "../sequelize.js";

// check the health of the application
const checkHealth = async (req, res) => {
  if (req.method === 'GET' && req.headers['content-length'] > 0) {
    // get payload
    res.status(400).send();
  } else if (req.method === 'GET') {
    // get without payload
    try {
      await sequelize.authenticate();
      res.set('Cache-control', 'no-cache');
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(503).send();
    }
  } else {
    // all other request
    res.status(404).send();
  }
};

export default checkHealth;




//draft code, added comments above and else block for other requests
// import sequelize from "../sequelize.js";

// // check the health of the application
// const checkHealth = async (req, res) => {
//   const length = req.headers['content-length'];
//   if ((req.method === 'GET' && length > 0) || req.url.includes('?')) {
//     res.status(400).send();
//   } else {
//     try {
//       await sequelize.authenticate();
//       res.set('Cache-control', 'no-cache');
//       res.status(200).send();
//     } catch (error) {
//       console.error(error);
//       res.status(503).send();
//     }
//   }else {
//     // All other request methods
//     res.status(404).send();
//   }
// };

// export default checkHealth;
