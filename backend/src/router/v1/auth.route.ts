
import { loginSchema, registrationSchema, verificationSchema, type RegisterInput } from "@/validators";
import { authController } from "@/controller";
import { validate, validateQuery } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post("/register",validate(registrationSchema),authController.register );
router.get("/verify-email",validateQuery(verificationSchema),authController.verifyEmail );
router.post("/login",validate(loginSchema),authController.login);


export default router;