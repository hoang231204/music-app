import {Router} from "express";
import * as topicController from "../../controllers/admin/topic-controller";
const router: Router = Router();
router.get("/", topicController.index);
export default router;