  import request from "supertest";
  import router from "../../app.js"; // Import your Express app instance from your main app file
  import express from "express";
  import bodyParser from "body-parser";
  //
  import * as dotenv from 'dotenv'
  dotenv.config()
  //

  const app = express();
  
app.use(bodyParser.json());

app.use(router);
  describe("Healthz Endpoint", () => {
    it(" Return 200 for successful GET requests without body or query", async () => {
      const res = await request(app).get("/healthz");
      expect(res.statusCode).toEqual(200);
    });
  });
//////////////


   
