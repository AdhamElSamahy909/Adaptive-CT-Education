const request = require("supertest");
const app = require("./app");

describe("Node Server Santy Check", () => {
  it("should return 200 on the health check endpoint", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
