
import  express  from "express";
import authRoutes from "./auth.route";
import paymentRoutes from "./payments.route";


const app = express();


app.use("/auth",authRoutes)
app.use("/payments",paymentRoutes)


export default app;

