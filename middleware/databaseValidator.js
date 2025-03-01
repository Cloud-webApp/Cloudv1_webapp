import db from '../dbSetup.js';
import logger from '../config/logger.config.js';
export default async (req, res, next) => {
  try {
    // Check if the database connection is successful
    await db.sequelize.authenticate();
    next();
  } catch (err) {
    console.error(err);
    logger.fatal("Fatal HEALTH CHECK!!!- Error while connecting to the db", err);
    return res.status(503).send(); // Service Unavailable
  }
};
