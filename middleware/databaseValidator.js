import db from "../dbSetup.js";

export default async (req,res,next)=>{
    try{
        await db.sequelize.authenticate();
        next();
    }catch(err){
        console.log(err);
        return res.status(503).send();
    }
}