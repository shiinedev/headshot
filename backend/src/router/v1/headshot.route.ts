import { headshotController } from "@/controller";
import { authenticate, upload, validate } from "@/middlewares";
import { headshotPhotoSchema } from "@/validators/headshot.validator";
import Express from "express"


const headshotRoute = Express.Router();


headshotRoute.use(authenticate);


headshotRoute.get("/styles",headshotController.getAvailableStyles);
headshotRoute.post("/generate",upload.single("photo"),validate(headshotPhotoSchema), headshotController.generateHeadshot);
headshotRoute.get("/", headshotController.getHeadshots);
headshotRoute.delete("/:id", headshotController.deleteHeadshot);


export default headshotRoute;