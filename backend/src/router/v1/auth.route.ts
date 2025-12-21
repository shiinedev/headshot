
import { registrationSchema, type RegisterInput } from "@/validators";
import { register } from "@/controller";
import { validate } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post("/register",validate(registrationSchema),register );

export default router;