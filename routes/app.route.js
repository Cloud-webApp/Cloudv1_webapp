import sequelize from "../sequelize.js";

const checkHealth = async (req, res) => {
  const length = req.headers['content-length'];
  if ((req.method === 'GET' && length > 0) || req.url.includes('?')) {
    res.status(400).send();
  } else {
    try {
      await sequelize.authenticate();
      res.set('Cache-control', 'no-cache');
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(503).send();
    }
  }
};

export default checkHealth;
