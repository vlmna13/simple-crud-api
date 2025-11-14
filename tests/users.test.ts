import request from "supertest";
import { createServer } from "../src/server";

const app = createServer();

describe("Users API", () => {
  let createdUserId: string;

  it("GET /api/users → should return empty array", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /api/users → should create a new user", async () => {
    const newUser = {
      username: "Alice",
      age: 25,
      hobbies: ["reading", "coding"],
    };

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.username).toBe(newUser.username);
    expect(res.body.age).toBe(newUser.age);

    createdUserId = res.body.id;
  });

  it("GET /api/users/:id → should return created user", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
    expect(res.body.username).toBe("Alice");
  });

  it("PUT /api/users/:id → should update user", async () => {
    const updatedData = { username: "AliceUpdated", age: 26 };

    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("AliceUpdated");
    expect(res.body.age).toBe(26);
  });

  it("DELETE /api/users/:id → should delete user", async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.status).toBe(204);
  });

  it("GET /api/users/:id → should return 404 after deletion", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(404);
  });
});
