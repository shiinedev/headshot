import { paymentController } from "@/controller";
import {Router} from "express";

const router = Router();

router.get("/packages", paymentController.getCreditPackages);

export default router;