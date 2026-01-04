
import  express  from "express";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payments.routes";


const app = express();


app.use("/auth",authRoutes)
app.use("/payments",paymentRoutes)


export default app;

