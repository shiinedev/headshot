
import  express  from "express";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payments.routes";
import headShotRoutes from "./headshot.route";


const app = express();


app.use("/auth",authRoutes)
app.use("/payment",paymentRoutes)
app.use("/headshots",headShotRoutes);


export default app;

