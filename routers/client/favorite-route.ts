import { Router } from "express";
import * as favoriteController from "../../controllers/client/favorite-controller";
import { requireUserAuth } from "../../middlewares/client/auth-middleware";

const router = Router();
router.get("/", requireUserAuth, favoriteController.index);
router.post("/toggle/:songId", requireUserAuth, favoriteController.toggleFavorite);

export default router;