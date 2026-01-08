
import  express  from "express";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payments.routes";


const app = express();


app.use("/auth",authRoutes)
app.use("/payment",paymentRoutes)


export default app;

