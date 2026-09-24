import {Router} from "express";
import * as topicController from "../../controllers/client/topic-controller";
import * as songController from "../../controllers/client/song-controller";
const router = Router();
router.get("/", topicController.index);
router.get("/:slugTopic", songController.index);
export default router;