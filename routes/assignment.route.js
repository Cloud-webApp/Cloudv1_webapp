import { Router } from "express";
import db from "../dbSetup.js";
import basicAuthenticator from "../middleware/basicAuthenticator.js";
import _ from "lodash";
import assignmentValidator from "../validators/assignment.validator.js";
import queryParameterValidators from "../validators/queryParameterValidators.js";
import logger from '../config/logger.config.js';
import submissionUrlValidator from "../submissionUrlValidator.js";
import StatsD from 'node-statsd';
import * as AWS from 'aws-sdk'; 
dotenv.config();

const statsd = new StatsD({ host: 'localhost', port: 8125 }); 


const assignmentRouter = Router();
const assignmentDb = db.assignments;


// Middleware to restrict HTTP methods
assignmentRouter.use("/", async (req, res, next) => {
  if (
    req.method !== "GET" &&
    req.method !== "POST" &&
    req.method !== "DELETE" &&
    req.method !== "PUT"
  ) {
    logger.warn('405 checker- method not allowed bro');
    return res.status(405).send(); // Method Not Allowed
  }
  next();
});

assignmentRouter.get("/",basicAuthenticator, queryParameterValidators, async (req, res) => {
  statsd.increment('endpoint.assignment.getall');

  if (Object.keys(req.query).length > 0) {
    // If query parameters are present, return a 400 Bad Request
    return res.status(400).json({ errorMessage: "Query parameters are not allowed for this endpoint." });
  }

  if (Object.keys(req.body).length > 0) {
    // If there is a request body (payload), return a 400 Bad Request
    return res.status(400).json({ errorMessage: "Payload is not allowed for this endpoint." });
  }

  try {
    const assignmentList = await assignmentDb.findAll({
      attributes: { exclude: ["user_id"] },
    });
    logger.info('logs from assignment.route.js List-',assignmentList);
    res.status(200).json(assignmentList);
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

// GET assignment by ID----------------------------------------------------------------------------------
assignmentRouter.get("/:id", queryParameterValidators, async (req, res) => {
  
  statsd.increment('endpoint.assignment.getbyid');
  const { id: assignmentId } = req.params;

  try {
    const assignmentInfo = await db.assignments.findOne({
      attributes: { exclude: ["user_id"] },
      where: { assignment_id: assignmentId },
    });

    if (_.isEmpty(assignmentInfo)) {
      logger.error('404 error Assignment not found of id: ',assignmentId);
      return res.status(404).send();     //did 400 earlier
    } else {
      logger.info('logs from assignment.route.js Info-',assignmentInfo);
      res.status(200).json(assignmentInfo);
    }
  } catch (error) {
    console.error(error);
    logger.error('500 error Internal Server Error');
    res.status(500).send(); // Internal Server Error
  }
});

//POST a new assignment ----------------------------------------------------------------------------------
assignmentRouter.post(
  "/",
  basicAuthenticator,
  queryParameterValidators,
  async (req, res) => {
    let { name, points, num_of_attemps, deadline } = req.body;
    if(!_.isInteger(points) || !_.isInteger(num_of_attemps)){
      logger.error("Invalid request body");
      return res.status(400).json({ error : "Points and Number of Attempts should be Integer" });
    }
    const expectedKeys = ["name", "points", "num_of_attemps", "deadline"];
    // Check if there are any extra keys in the request body
    const extraKeys = Object.keys(req.body).filter(
      (key) => !expectedKeys.includes(key)
    );
 
    if (extraKeys.length > 0) {
      logger.error("Invalid keys in the request", extraKeys);
      return res.status(400).json({
        errorMessage: `Invalid keys in the request: ${extraKeys.join(", ")}`,
      });
    }
    const { isError: isNotValid, errorMessage } =
      assignmentValidator.validatePostRequest(req);
    if (isNotValid) {
      logger.error("Invalid request body", errorMessage);
      return res.status(400).json({ errorMessage });
    }
 
    const tempAssignment = {
      name,
      points,
      num_of_attemps,
      deadline,
      user_id: req?.authUser?.user_id,
    };
    //insert the data to data base
    const newAssignment = await assignmentDb.create(tempAssignment);
    logger.info("New assignment created", newAssignment);
    delete newAssignment.dataValues.user_id;
    res.status(201).json(newAssignment);
  }
);

// DELETE an assignment by ID----------------------------------------------------------------------------------
assignmentRouter.delete("/:id", basicAuthenticator, queryParameterValidators, async (req, res) => {
  statsd.increment('endpoint.assignment.delete');
  const { id: assignmentId } = req.params;

    // payload should not be present
  if (Object.keys(req.body).length !== 0) {
    logger.error('400 error Bad Request: DELETE request should not have a payload');
    return res.status(400).json({ error: "Bad Request: DELETE request should not have a payload" });
  }

  try {
    const assignmentInfo = await db.assignments.findOne({
      where: { assignment_id: assignmentId },
    });

    if (_.isEmpty(assignmentInfo)) {
      logger.error('404 error Assignment not found of id: ',assignmentId);
      return res.status(404).send();   //updated
    } else if (assignmentInfo.user_id !== req?.authUser?.user_id) {
      logger.error('403 error Your are not authorized user');
      return res.status(403).json({ error: "Your are not authorized user" });
    }

    await db.assignments.destroy({ where: { assignment_id: assignmentId } });
    logger.info('logs from assignment.route.js Assignment deleted of id: ',assignmentId);
    res.status(204).json();
  } catch (error) {
    logger.error('500 error Internal Server Error');
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

// PUT (update) an assignment by ID----------------------------------------------------------------------------------
assignmentRouter.put("/:id", basicAuthenticator, async (req, res) => {
  statsd.increment('endpoint.assignment.put');
  const { id: assignmentId } = req.params;

  const { isError: isNotValid, errorMessage } = assignmentValidator.validateUpdateRequest(req);

  if (isNotValid) {
    logger.error('400 error Invalid keys in the request: ',errorMessage);
    return res.status(400).json({ errorMessage });
  }
 // Check for extra keys in the request body
 const expectedKeys = ["name", "points", "num_of_attemps", "deadline"];

 const extraKeys = Object.keys(req.body).filter(
  (key) => !expectedKeys.includes(key)
);

if (extraKeys.length > 0) {
  logger.error('400 error Invalid keys in the request: ',extraKeys);
  return res.status(400).json({
    errorMessage: `Invalid keys in the request: ${extraKeys.join(", ")}`,
  });
}
  try {
    const assignmentInfo = await db.assignments.findOne({
      where: { assignment_id: assignmentId },
    });

    if (_.isEmpty(assignmentInfo)) {
      logger.error('404 error Assignment not found of id: ',assignmentId);
      return res.status(404).send();
    } else if (assignmentInfo.user_id !== req?.authUser?.user_id) {
      logger.warn('403 error Your are not authorized user');
      return res.status(403).json({ error: "Your are not authorized user" });
    }

    const { name, points, num_of_attemps, deadline } = req.body;

    let updatedAssignment = {};

    updatedAssignment = appendDataToObject(updatedAssignment, "name", name);
    updatedAssignment = appendDataToObject(updatedAssignment, "points", points);
    updatedAssignment = appendDataToObject(updatedAssignment, "num_of_attemps", num_of_attemps);
    updatedAssignment = appendDataToObject(updatedAssignment, "deadline", deadline);

    await db.assignments.update(updatedAssignment, { where: { assignment_id: assignmentId } });
    logger.info('logs from assignment.route.js Assignment SUCCESS updated of id: ',assignmentId);
    res.status(204).end(); // Success, no content
  } catch (error) {
    logger.error('500 error Internal Server Error');
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

const sns = new AWS.SNS();

assignmentRouter.post( "/:id/submissions",basicAuthenticator, queryParameterValidators, async (req, res) => {
    const { id: assignmentId } = req.params;
    const { isError: isNotValid, errorMessage } =
      assignmentValidator.validateAssignmentPostRequest(req);

    if (isNotValid) {
      logger.error("Invalid request body", errorMessage);
      return res.status(400).json({ errorMessage });
    }

    const { submission_url } = req.body;

    if (!submissionUrlValidator(submission_url)) {
      logger.error("Invalid Submission URL");
      return res.status(400).json({ errorMessage: "Invalid Submission URL" });
    }
    try {
      const assignmentInfo = await db.assignments.findOne({
        where: { assignment_id: assignmentId },
      });

      const count = await db.submissions.count({
        where: { assignment_id: assignmentId },
      });
      if (_.isEmpty(assignmentInfo)) {
        logger.error("Assignment with the following id not found", assignmentId);
        return res.status(404).send();
      } else if (assignmentInfo.user_id !== req?.authUser?.user_id) {
        logger.warn("Not an authorized user");
        return res.status(403).json({ error: "You are not an authorized user" });
      } else if (assignmentInfo.deadline < new Date()) {
        logger.warn("Assignment deadline is over");
        return res.status(400).json({ error: "Assignment deadline is over" });
      } else if (count >= assignmentInfo.num_of_attemps) {
        logger.warn("Reached max. number of attempts");
        return res.status(400).json({ error: "You have reached the maximum number of attempts" });
      }

      const tempSubmission = {
        submission_url,
        assignment_id: assignmentId,
        user_id: req?.authUser?.user_id,
      };

      // Insert the data into the database
      const newSubmission = await db.submissions.create(tempSubmission);
      logger.info("New submission created", newSubmission);
      delete newSubmission.dataValues.user_id;

      // Publisshing submission details to SNS
      const snsParams = {
        Message: JSON.stringify({
          submission_url: newSubmission.submission_url,
          user_id: newSubmission.user_id,
          email: req?.authUser?.email,
        }),
        TopicArn:  process.env.SNS_TOPIC_ARN, 
      };

      sns.publish(snsParams, (snsErr, snsData) => {
        if (snsErr) {
          logger.error("Error publishing to SNS", snsErr);
        } else {
          logger.info("Submission details published to SNS", snsData);
        }
      });

      res.status(201).json(newSubmission);
    } catch (err) {
      logger.error("Assignment with the following id not found", assignmentId);
      res.status(404).send();
    }
  }
);

// Helper function to append data to an object if it's not null or undefined
function appendDataToObject(object, field, value) {
  if (!_.isNil(value)) {
    object[field] = value;
  }
  return object;
}

export default assignmentRouter;
