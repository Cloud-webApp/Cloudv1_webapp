import Router from 'express';
import db from "../models/index.js";
import basicAuthenticator from "../middlewares/basicAuthenticator.js";
import _ from 'lodash';

import assignmentValidator from "../validators/assignmentValidator.js";

const assignmentRouter = Router();
const assignmentDb = db.assignments;

assignmentRouter.get("/", basicAuthenticator, async (req, res) => {

    const assignmentList = await assignmentDb.findAll();
    console.log(req.authUser);
    res.status(200).json(assignmentList);
});


assignmentRouter.get("/:id", async (req, res) => {
    const { id: assignmentId } = req.params;
    const assignmentInfo = await db.assignments.findOne({ where: { id: assignmentId } });
    if (_.isEmpty(assignmentInfo)) {
        return res.status(400).send();
    } else {
        res.status(200).json(assignmentInfo);
    }

});


assignmentRouter.post("/", basicAuthenticator, async (req, res) => {

    let { name, points, num_of_attemps, deadline } = req.body;
    //validate the body
    const { isError: isNotValid, errorMessage } = assignmentValidator.validatePostRequest(req);
    if (isNotValid) {
        return res.status(400).json({ errorMessage });
    }
    const tempAssignment = {
        name, points, num_of_attemps, deadline,
        createdBy: req?.authUser?.id,
        updatedBy: req?.authUser?.id
    }
    //insert the data to data base
    const newAssignment = await assignmentDb.create(tempAssignment);
    res.status(201).json(newAssignment);
});


assignmentRouter.delete("/:id", basicAuthenticator, async (req, res) => {

    const { id: assignmentId } = req.params;
    const assignmentInfo = await db.assignments.findOne({ where: { id: assignmentId } });
    if (_.isEmpty(assignmentInfo)) {
        return res.status(400).send();
    } else if (assignmentInfo.createdBy !== req?.authUser?.email) {
        return res.status(401).json({ error: "Your are not authorized user" })
    }

    await db.assignments.destroy({ where: { id: assignmentId } });

    return res.status(200).json(assignmentInfo);
});

assignmentRouter.put("/:id", basicAuthenticator, async (req, res) => {
    const { id: assignmentId } = req.params;
    //validate the request payload
    const { isError: isNotValid, errorMessage } = assignmentValidator.validateUpdateRequest(req);
    if (isNotValid) {
        return res.status(400).json({ errorMessage });
    }
    const assignmentInfo = await db.assignments.findOne({ where: { id: assignmentId } });
    if (_.isEmpty(assignmentInfo)) {
        return res.status(400).send();
    } else if (assignmentInfo.createdBy !== req?.authUser?.id) {
        return res.status(401).json({ error: "Your are not authorized user" })
    }
    const { name, points, num_of_attemps, deadline } = req.body;

    let updatedAssignment = {
        updatedBy: req?.authUser?.id
    }
    updatedAssignment = appendDataToObject(updatedAssignment, 'name', name);
    updatedAssignment = appendDataToObject(updatedAssignment, 'points', points);
    updatedAssignment = appendDataToObject(updatedAssignment, 'num_of_attemps', num_of_attemps);
    updatedAssignment = appendDataToObject(updatedAssignment, 'deadline', deadline);


    await db.assignments.update(updatedAssignment, { where: { id: assignmentId } });

    delete assignmentId?.updatedBy;
    return res.status(204).send();
});

function appendDataToObject(object,field,value){
    if(!_.isNil(value)){
        object[field]=value;
    }
    return object;
}
export default assignmentRouter;