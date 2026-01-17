
import  express  from "express";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payments.routes";
import headShotRoutes from "./headshot.route";
import adminRoutes from "./admin.router";


const app = express();


app.use("/auth",authRoutes)
app.use("/payment",paymentRoutes)
app.use("/headshots",headShotRoutes);
app.use("/admin", adminRoutes);


export default app;

