import { Router } from "express";
import db from "../dbSetup.js";
import basicAuthenticator from "../middleware/basicAuthenticator.js";
import _ from "lodash";
import assignmentValidator from "../validators/assignment.validator.js";
import queryParameterValidators from "../validators/queryParameterValidators.js";

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
    return res.status(405).send(); // Method Not Allowed
  }
  next();
});

// GET all assignments
assignmentRouter.get("/", queryParameterValidators, async (req, res) => {
  try {
    const assignmentList = await assignmentDb.findAll({
      attributes: { exclude: ["user_id"] },
    });

    res.status(200).json(assignmentList);
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

// GET assignment by ID
assignmentRouter.get("/:id", queryParameterValidators, async (req, res) => {
  const { id: assignmentId } = req.params;

  try {
    const assignmentInfo = await db.assignments.findOne({
      attributes: { exclude: ["user_id"] },
      where: { assignment_id: assignmentId },
    });

    if (_.isEmpty(assignmentInfo)) {
      return res.status(400).send();
    } else {
      res.status(200).json(assignmentInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

// POST a new assignment
assignmentRouter.post("/", basicAuthenticator, queryParameterValidators, async (req, res) => {
  const expectedKeys = ["name", "points", "num_of_attemps", "deadline"];

  // Check for extra keys in the request body
  const extraKeys = Object.keys(req.body).filter(
    (key) => !expectedKeys.includes(key)
  );

  if (extraKeys.length > 0) {
    return res.status(400).json({
      errorMessage: `Invalid keys in the request: ${extraKeys.join(", ")}`,
    });
  }

  let { name, points, num_of_attemps, deadline } = req.body;

  const { isError: isNotValid, errorMessage } = assignmentValidator.validatePostRequest(req);

  if (isNotValid) {
    return res.status(400).json({ errorMessage });
  }

  const tempAssignment = {
    name,
    points,
    num_of_attemps,
    deadline,
    user_id: req?.authUser?.user_id,
  };

  try {
    const newAssignment = await assignmentDb.create(tempAssignment);
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

// DELETE an assignment by ID
assignmentRouter.delete("/:id", basicAuthenticator, queryParameterValidators, async (req, res) => {
  const { id: assignmentId } = req.params;

  try {
    const assignmentInfo = await db.assignments.findOne({
      where: { assignment_id: assignmentId },
    });

    if (_.isEmpty(assignmentInfo)) {
      return res.status(400).send();
    } else if (assignmentInfo.user_id !== req?.authUser?.user_id) {
      return res.status(403).json({ error: "Your are not authorized user" });
    }

    await db.assignments.destroy({ where: { assignment_id: assignmentId } });

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

// PUT (update) an assignment by ID
assignmentRouter.put("/:id", basicAuthenticator, async (req, res) => {
  const { id: assignmentId } = req.params;

  const { isError: isNotValid, errorMessage } = assignmentValidator.validateUpdateRequest(req);

  if (isNotValid) {
    return res.status(400).json({ errorMessage });
  }
 // Check for extra keys in the request body
 const expectedKeys = ["name", "points", "num_of_attemps", "deadline"];

 const extraKeys = Object.keys(req.body).filter(
  (key) => !expectedKeys.includes(key)
);

if (extraKeys.length > 0) {
  return res.status(400).json({
    errorMessage: `Invalid keys in the request: ${extraKeys.join(", ")}`,
  });
}
  try {
    const assignmentInfo = await db.assignments.findOne({
      where: { assignment_id: assignmentId },
    });

    if (_.isEmpty(assignmentInfo)) {
      return res.status(400).send();
    } else if (assignmentInfo.user_id !== req?.authUser?.user_id) {
      return res.status(403).json({ error: "Your are not authorized user" });
    }

    const { name, points, num_of_attemps, deadline } = req.body;

    let updatedAssignment = {};

    updatedAssignment = appendDataToObject(updatedAssignment, "name", name);
    updatedAssignment = appendDataToObject(updatedAssignment, "points", points);
    updatedAssignment = appendDataToObject(updatedAssignment, "num_of_attemps", num_of_attemps);
    updatedAssignment = appendDataToObject(updatedAssignment, "deadline", deadline);

    await db.assignments.update(updatedAssignment, { where: { assignment_id: assignmentId } });

    res.status(204).end(); // Success, no content
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Internal Server Error
  }
});

// Helper function to append data to an object if it's not null or undefined
function appendDataToObject(object, field, value) {
  if (!_.isNil(value)) {
    object[field] = value;
  }
  return object;
}

export default assignmentRouter;
