import express from 'express';
import appRoute from './routes/app.route.js';
import assignmentRoute from './routes/assignment.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/healthz", appRoute);
app.use("/v1/assignments", assignmentRoute);

//  503 status for any other request
app.use("/", (req, res) => res.status(503).send());

//  Express server
app.listen(PORT, (err) => {
    if (err) {
        console.log("Failed to start the application");
    } else {
        console.log("Application running on port number", PORT);
    }
});
