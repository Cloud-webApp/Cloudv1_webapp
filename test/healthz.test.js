import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import router from "../routes/app.route.js";
import * as dotenv from 'dotenv'

dotenv.config()
const app = express();
app.use(bodyParser.json());
app.use(router);
describe("Healthz Endpoint", () => {
  it("returns a 200 status code on successful health check", async () => {
    // Mock successful DB connection for this test
    jest.mock("../dbSetup.js", () => ({
      connectionTest: () => Promise.resolve(),
    }));
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toEqual(200);

  });

});
