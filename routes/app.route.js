import sequelize from "../sequelize.js";

// check the health of the application
const checkHealth = async (req, res) => {
  if (req.method === 'GET' && req.headers['content-length'] > 0) {
    // get payload
    res.status(400).send();             //works
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
    res.status(405).send();   //works
  }
};

export default checkHealth;

