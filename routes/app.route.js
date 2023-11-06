import sequelize from "../sequelize.js";

import StatsD from 'node-statsd';
const statsd = new StatsD({ host: 'localhost', port: 8125 }); 


// check the health of the application
const checkHealth = async (req, res) => {
  statsd.increment('endpoint.health')
  if (req.method === 'GET' && (req.headers['content-length'] > 0 || Object.keys(req.query).length > 0)) {
    // GET request with payload in either body or query parameters
    res.status(400).json({ errorMessage: "Payload in query parameters is not allowed." });
  } else if (req.method === 'GET') {
    // GET without payload
    try {
      await sequelize.authenticate();
      res.set('Cache-control', 'no-cache');
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(503).send();
    }
  } else {
    // All other request methods
    res.status(405).send();
  }
};

export default checkHealth;