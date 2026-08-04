import {Express} from "express";
import authRouter from "./auth-route";
import topicRouter from "./topic-route";
import dashboardRouter from "./dashboard-route";
const route = (app: Express)=>{
    app.use("/admin/auth", authRouter);
    app.use("/admin/topics", topicRouter);
    app.use("/admin/dashboard", dashboardRouter);
}

export default route;