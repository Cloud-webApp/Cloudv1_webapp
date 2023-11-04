import express from 'express';
import appRoute from './routes/app.route.js';
import assignmentRoute from './routes/assignment.route.js';

import logger from './config/logger.config.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/healthz", appRoute); // Route for /healthz
app.use("/v1/assignments", assignmentRoute); // Route for /v1/assignments

// Middleware for all other routes
app.use("/", (req, res) => {
  res.status(404).send(); // Return 503 Service Unavailable for all other routes
});

// Express server
app.listen(PORT, (err) => {
  logger.info("logs from app.js");
  if (err) {
    console.log("Failed to start the application");
  } else {
    console.log("Application running on port number", PORT);
  }
});

// // Middleware for /healthz only
// app.use("/healthz", (req, res, next) => {
//   if (req.method === "GET") {
//     res.status(200).send(); // Return 200 OK for GET requests to /healthz
//   } else {
//     console.log(req.method,'405 checker');
//     res.status(405).send(); // Return 405 Not Found for all other requests to /healthz
    
//   }
// });
