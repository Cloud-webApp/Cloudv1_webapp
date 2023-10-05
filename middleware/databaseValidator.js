import db from '../dbSetup.js';

export default async (req, res, next) => {
  try {
    // Check if the database connection is successful
    await db.sequelize.authenticate();
    next();
  } catch (err) {
    console.error(err);
    return res.status(503).send(); // Service Unavailable
  }
};
