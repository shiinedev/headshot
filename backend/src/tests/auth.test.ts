import request from "supertest";
import app from "@/app";
import mongoose from "mongoose";
import { config } from "@/config";
import {describe, test, expect, beforeAll, afterAll } from "jest"

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(config.database);
  });
  describe("/auth/register", () => {
    test("should register a new user", async () => {
      // Test logic for user registration

      const random = Math.floor(Math.random() * 10000);
      const result = await request(app).post("/api/v1/auth/register").send({
        name: "Test User",
        email: `test${random}@email.com`,
        password: "StrongP@ssw0rd!",
        confirmPassword: "StrongP@ssw0rd!",
      });

      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("success", true);
      expect(result.body).toHaveProperty("message", "User registered successfully");
      expect(result.body).toHaveProperty("data");
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
