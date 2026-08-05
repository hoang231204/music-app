import {Express} from "express";
import authRouter from "./auth-route";
import topicRouter from "./topic-route";
import singerRouter from "./singer-route";
import songRouter from "./song-route";
import dashboardRouter from "./dashboard-route";
const route = (app: Express)=>{
    app.use("/admin/auth", authRouter);
    app.use("/admin/topics", topicRouter);
    app.use("/admin/dashboard", dashboardRouter);
    app.use("/admin/singers", singerRouter);
    app.use("/admin/songs", songRouter);
}

export default route;