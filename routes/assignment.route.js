import {Router} from 'express';
import db from "../dbSetup.js";
import basicAuthenticator from "../middleware/basicAuthenticator.js";
import _ from 'lodash';
import assignmentValidator from "../validators/assignment.validator.js";

const assignmentRouter= Router();
const assignmentDb=db.assignments;

assignmentRouter.get("/", async (req,res)=>{
     const assignmentList= await assignmentDb.findAll({attributes: { exclude: ['user_id'] }});
    console.log(req.authUser);
    res.status(200).json(assignmentList);
});


assignmentRouter.get("/:id",async (req,res)=>{
    const {id:assignmentId}=req.params;
    const assignmentInfo=await db.assignments.findOne({attributes: { exclude: ['user_id'] },where:{assignment_id:assignmentId}});
    if(_.isEmpty(assignmentInfo) ){
         return res.status(400).send();
    }else {
        res.status(200).json(assignmentInfo);
    }

});


assignmentRouter.post("/",basicAuthenticator, async (req,res)=>{

    let {name,points,num_of_attemps,deadline}=req.body;
    
    const {isError:isNotValid,errorMessage}=assignmentValidator.validatePostRequest(req);
    if(isNotValid){
        return res.status(400).json({errorMessage});
    }

    const tempAssignment={
        name,points,num_of_attemps,deadline,
        user_id:req?.authUser?.user_id,
    }

    const newAssignment= await assignmentDb.create(tempAssignment);
    console.log(newAssignment);
    res.status(201).json(newAssignment);
});


assignmentRouter.delete("/:id",basicAuthenticator,async (req,res)=>{

    const {id:assignmentId}=req.params;
    const assignmentInfo=await db.assignments.findOne({where:{assignment_id:assignmentId}});
    if(_.isEmpty(assignmentInfo) ){
         return res.status(400).send();
    }else if(assignmentInfo.user_id !== req?.authUser?.user_id){
        return res.status(401).json({error:"Your are not authorized user"})
    }

    await db.assignments.destroy({where:{assignment_id:assignmentId}});

    return res.status(204).json();
});

assignmentRouter.put("/:id",basicAuthenticator,async (req,res)=>{

    const {id:assignmentId}=req.params;

    const {isError:isNotValid,errorMessage}=assignmentValidator.validateUpdateRequest(req);
    if(isNotValid){
        return res.status(400).json({errorMessage});
    }

    const assignmentInfo=await db.assignments.findOne({where:{assignment_id:assignmentId}});
    if(_.isEmpty(assignmentInfo) ){
         return res.status(400).send();
    }else if(assignmentInfo.user_id !== req?.authUser?.user_id){
        return res.status(401).json({error:"Your are not authorized user"})
    }
    const {name,points,num_of_attemps,deadline}= req.body;
    
    let updatedAssignment={
        
    }
    updatedAssignment=appendDataToObject(updatedAssignment,'name',name);
    updatedAssignment=appendDataToObject(updatedAssignment,'points',points);
    updatedAssignment=appendDataToObject(updatedAssignment,'num_of_attemps',num_of_attemps);
    updatedAssignment=appendDataToObject(updatedAssignment,'deadline',deadline);
   
    
    await db.assignments.update(updatedAssignment,{where:{assignment_id:assignmentId}});
    
    return res.status(204).end()//add success messgae

   });


function appendDataToObject(object,field,value){
    if(!_.isNil(value)){
        object[field]=value;
    }
    return object;
}


export default assignmentRouter;