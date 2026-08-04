import {Router} from "express";
import * as topicController from "../../controllers/admin/topic-controller";
const router: Router = Router();
router.get("/", topicController.index);
router.get("/edit/:id",topicController.edit)
export default router;