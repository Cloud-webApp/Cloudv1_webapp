import _ from "lodash";

// Validation function for POST requests
const validatePostRequest = (req) => {
  const { name, points, num_of_attemps, deadline } = req.body;
  let isError = false;
  let errorMessage = "";

  //  name
  if (_.isNil(name) || _.isEmpty(name)) {
    isError = true;
    errorMessage += "Name cannot be null or empty\n";
  }

  //  points range (1-10)
  if (_.isNil(points) || !_.inRange(points, 1, 11)) {
    isError = true;
    errorMessage += "Points need to be in the range of 1-10\n";
  }

  //  num_of_attemps range (1-3)
  if (_.isNil(num_of_attemps) || !_.inRange(num_of_attemps, 1, 4)) {
    isError = true;
    errorMessage += "Number of attempts need to be in the range of 1-3\n";
  }

  //  deadline format (YYYY-MM-DDTHH:MM:SS.SSSZ)
  if (
    _.isNil(deadline) ||
    !_.isString(deadline) ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(deadline)
  ) {
    isError = true;
    errorMessage +=
      "The deadline is required and should be in the format YYYY-MM-DDTHH:MM:SS.SSSZ";
  }

  return { isError, errorMessage };
};




//  function for PUT requests-------------------------------------
const validateUpdateRequest = (req) => {
  const { name, points, num_of_attemps, deadline } = req.body;
  let isError = false;
  let errorMessage = "";

  //  name
 
  if (_.isNil(name) || _.isEmpty(name)) {
   isError = true;
   errorMessage += "Name cannot be null or empty\n";
 }

  //  points range (1-10)
  if (!_.isNil(points) && !_.inRange(points, 1, 11)) {
    isError = true;
    errorMessage += "Points need to be in the range of 1-10\n";
  }

  //  num_of_attemps range (1-3)
  if (!_.isNil(num_of_attemps) && !_.inRange(num_of_attemps, 1, 4)) {
    isError = true;
    errorMessage += "Number of attempts need to be in the range of 1-3\n";
  }

  //  deadline format (YYYY-MM-DDTHH:MM:SS.SSSZ)
  if (
    !_.isNil(deadline) &&
    (!_.isString(deadline) ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(deadline))
  ) {
    isError = true;
    errorMessage +=
      "The deadline is required and should be in the format YYYY-MM-DDTHH:MM:SS.SSSZ";
  }

  return { isError, errorMessage };
};

export default {
  validatePostRequest,
  validateUpdateRequest,
};

