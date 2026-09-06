import {Router} from "express";
import * as songController from "../../controllers/client/song-controller";
const router = Router();
router.get("/", songController.index);
router.get("/:slugSong", songController.detail);
export default router;