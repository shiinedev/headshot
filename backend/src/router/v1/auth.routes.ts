
import { loginSchema, registrationSchema, resendVerificationSchema, verificationSchema} from "@/validators";
import { authController } from "@/controller";
import { validate, validateQuery } from "@/middlewares";
import { Router } from "express";
import { authenticate } from "@/middlewares";
import { authRateLimitConfig } from "@/middlewares/rateLimit";

const router = Router();

router.post("/register", authRateLimitConfig.register,validate(registrationSchema),authController.register );
router.get("/verify-email",validateQuery(verificationSchema),authController.verifyEmail );
router.post("/resend-verification",validate(resendVerificationSchema),authController.resendVerification );
router.post("/login",authRateLimitConfig.login, validate(loginSchema),authController.login);
router.get("/me",authenticate,authController.getCurrentUser);
router.post("/refresh-token",authController.refreshToken);
router.post("/logout",authenticate,authController.logout);


export default router;