import {Router} from "express";
import * as homeController from "../../controllers/client/home-controller";
const router = Router();
router.get("/", homeController.index);
export default router;