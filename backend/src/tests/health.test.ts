import app from "@/app";
import request from "supertest";
import { describe, test, expect } from "bun:test";

describe("API Endpoints",() =>{

    describe("Health Check",() =>{
        test("should return 200 OK", async () => {
            // Simulate a health check request
            const response = await request(app).get("/health");

            // Assert the response status code
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "server is running");
            expect(response.body).toHaveProperty("timeStamp");
            expect(response.body).toHaveProperty("uptime");


    })    })

    describe("", () =>{

    })

    describe("",() =>{

    })

})

