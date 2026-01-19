import { adminController } from "@/controller";
import { authenticate, authorize } from "@/middlewares";
import { UserRole } from "@/models";
import  Express from "express";


const adminRoutes = Express.Router();


adminRoutes.use(authenticate);
adminRoutes.use(authorize(UserRole.ADMIN));
// users
adminRoutes.get("/users",adminController.getAllUsers)
adminRoutes.put("/update-user/:id",adminController.updateUserRole)
adminRoutes.post("/add-credits/:id",adminController.addUserCredits)
adminRoutes.delete("/delete-user/:id",adminController.deleteUser)
adminRoutes.put("/ban-user/:id",adminController.banUser)

// orders
adminRoutes.get("/orders",adminController.getAllOrders)
adminRoutes.post("/manual",adminController.createManualOrder)


export default adminRoutes;