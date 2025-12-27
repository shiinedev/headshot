
import { loginSchema, registrationSchema, type RegisterInput } from "@/validators";
import { login, register } from "@/controller";
import { validate } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post("/register",validate(registrationSchema),register );
router.post("/login",validate(loginSchema),login );


export default router;