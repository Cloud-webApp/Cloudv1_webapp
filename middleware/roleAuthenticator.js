import _ from 'lodash';
import db from "../dbSetup.js";
import bcrypt from "bcryptjs";
import logger from "../configs/logger.config.js";
import StatsD from "node-statsd";

const statsd = new StatsD({ host: "localhost", port: 8125 }); 

export default async (req,res,next)=>{
    switch (req.method) {
        case 'POST':
            statsd.increment('endpoint.createAssignment');
          break;
        case 'GET':
          // Checking if  single or all assignments
          if (req.params.id) {
            // GET by id
            statsd.increment('endpoint.getAssignmentById');
          } else {
            // GetAll assignments
            statsd.increment('endpoint.getAllAssignment');
          }
          break;
        case 'PUT':
            statsd.increment('endpoint.updateAssignment');
          break;
        case 'DELETE':
            statsd.increment('endpoint.deleteAssignment');
      }
    
    const authHeader= req.headers.authorization;
    
    if(_.isEmpty(authHeader)){
        res.setHeader('WWW-Authenticate', 'Basic');
        logger.warn("Authentication header is missing");
        return res.status(401).json({error:"Authentication header is missing"});
    }   
    const [username,password]= new Buffer.from(authHeader.split(' ')[1],
    'base64').toString().split(':');


    if(!_.isEmpty(username) && !_.isEmpty(password)){
        try{
            let authUser=await db.users.findOne({ where:{
                email:username,
            }});
            req.authUser=authUser.dataValues;
            delete req.authUser?.password;
        }catch(err){
            logger.warn("You are not authorized user");
            return res.status(403).json({error:"You are not authorized user"});
        }      
    }else{
         res.setHeader('WWW-Authenticate', 'Basic');
         logger.warn("You are not authorized user");
         return res.status(401).json({error:"You are not authorized user"});
    }
    next();
}