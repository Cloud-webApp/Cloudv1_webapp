import request from "supertest";
import app from "../app"; // Import your Express app instance from your main app file

describe("Healthz Endpoint", () => {
  it("should return 200 for successful GET requests without body or query", async () => {
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toEqual(200);
  });
});
