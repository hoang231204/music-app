import {Express} from "express";
import authRouter from "./auth-route";
import topicRouter from "./topic-route";
import singerRouter from "./singer-route";
import songRouter from "./song-route";
import roleRouter from "./role-route";
import accountRouter from "./account-route";
import userRouter from "./user-route";
import dashboardRouter from "./dashboard-route";
import {requireAuth} from "../../middlewares/admin/require-auth";
const route = (app: Express)=>{
    app.use("/admin/auth", authRouter);
    app.use("/admin/topics", requireAuth, topicRouter);
    app.use("/admin/dashboard", requireAuth, dashboardRouter);
    app.use("/admin/singers", requireAuth, singerRouter);
    app.use("/admin/songs", requireAuth, songRouter);
    app.use("/admin/roles", requireAuth, roleRouter);
    app.use("/admin/accounts", requireAuth, accountRouter);
    app.use("/admin/users", requireAuth, userRouter);
}

export default route;