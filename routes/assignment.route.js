import  Router  from 'express';
import db from "../models/index.js";
import basicAuthenticator from "../middlewares/basicAuthenticator.js";
import _ from 'lodash';
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
    const tempAssignment = {
        name, points, num_of_attemps, deadline,
        createdBy: req?.authUser?.email,
        updatedBy: req?.authUser?.email
    }
    //insert the data to data base
    const newAssignment = await assignmentDb.create(tempAssignment);
    console.log(newAssignment);
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

assignmentRouter.put("/:id", (req, res) => {

});


export default assignmentRouter;