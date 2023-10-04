import db from "../models/index.js";
export default  async (req,res,next) => {
    
    try {
        await db.sequelize.authenticate();
        
    } catch (error) {
        return res.status(503).send();
    }
    next();
}