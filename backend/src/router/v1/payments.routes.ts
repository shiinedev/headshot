import { paymentController } from "@/controller";
import { authenticate } from "@/middlewares";
import {Router} from "express";

const router = Router();


// public routes
router.get("/packages", paymentController.getCreditPackages);

//private routes

router.use(authenticate)

router.post("/process-payment", paymentController.processPayment);

export default router;