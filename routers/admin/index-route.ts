import {Express} from "express";
import authRouter from "./auth-route";

const route = (app: Express)=>{
    app.use("/admin/auth", authRouter);
}

export default route;