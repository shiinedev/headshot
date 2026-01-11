import { headshotController } from "@/controller";
import { authenticate, upload } from "@/middlewares";
import Express from "express"


const headshotRoute = Express.Router();


headshotRoute.use(authenticate);


headshotRoute.get("/styles",headshotController.getAvailableStyles);
headshotRoute.post("/generate",upload.single("photo"),headshotController.generateHeadshot);

export default headshotRoute;