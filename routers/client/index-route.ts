import {Express} from "express";
import authRouter from "./auth-route";
import topicRouter from "./topic-route";
import songRouter from "./song-route";
import searchRouter from "./search-route";
import homeRouter from "./home-route";
import {requireAuth} from "../../middlewares/admin/require-auth";
import favoriteRouter from "./favorite-route";
import { userMiddleware } from "../../middlewares/client/auth-middleware";
const route = (app: Express)=>{
    app.use(userMiddleware);
    app.use("/auth", authRouter);
    app.use("/topics", topicRouter);
    app.use("/songs",songRouter);
    app.use("/search", searchRouter);
    app.use("/favorites", favoriteRouter);
    app.use("/", homeRouter);
}

export default route;