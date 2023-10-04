import _ from "lodash";

const validatePostRequest = (req) => {
   const { name, points, num_of_attempts, deadline } = req.body;
   let isError = false;
   let errorMessage = "";
   if (_.isNil(name) || _.isEmpty(name)) {
      isError = true;
      errorMessage += "Name cannot be null or empty\n";
   }
   if (_.isNil(points) || !_.inRange(points, 1, 11)) {
      isError = true;
      errorMessage += "Points need to be in range on 1-10\n";
   }
   if (_.isNil(num_of_attempts) || !_.inRange(num_of_attempts, 1, 4)) {
      isError = true;
      errorMessage += "Number of attempts need to be in range of 1-3\n";
   }
   if (_.isNil(deadline) || !_.isString(deadline) || ! /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(deadline)) {
      isError = true;
      errorMessage += "The deadline is required and should be in the format 16-08-29T09:12:33.001Z";
   }

   return { isError, errorMessage };
}


const validateUpdateRequest = (req) => {
   const { name, points, num_of_attempts, deadline } = req.body;
   let isError = false;
   let errorMessage = "";
   if (!_.isNil(name) && !_.isEmpty(name)) {
      isError = true;
      errorMessage += "Name cannot be null or empty\n";
   }
   if (!_.isNil(points) && !_.inRange(points, 1, 11)) {
      isError = true;
      errorMessage += "Points need to be in range on 1-10\n";
   }

   if (!_.isNil(num_of_attempts) && !_.inRange(num_of_attempts, 1, 4)) {
      isError = true;
      errorMessage += "Number or attempts need to be in range of 1-3\n";
   }
   if (!_.isNil(deadline) && (!_.isString(deadline) || ! /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(deadline))) {
      isError = true;
      errorMessage += "The deadline is required and should be in the format 016-08-29T09:12:33.001Z";
   }

   return { isError, errorMessage };
}

export default {
   validatePostRequest,
   validateUpdateRequest
}