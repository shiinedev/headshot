import { adminController } from "@/controller";
import { authenticate } from "@/middlewares";
import  Express from "express";


const adminRoutes = Express.Router();


adminRoutes.use(authenticate);
adminRoutes.get("/users",adminController.getAllUsers)
adminRoutes.put("/update-user/:id",adminController.updateUserRole)
adminRoutes.post("/add-credits/:id",adminController.addUserCredits)
adminRoutes.delete("/delete-user/:id",adminController.deleteUser)
adminRoutes.put("/ban-user/:id",adminController.banUser)


export default adminRoutes;