import {Router} from "express";
import multer from "multer"
import * as topicController from "../../controllers/admin/topic-controller";
import { upload as uploadCloudinary } from "../../middlewares/admin/upload-cloudinary";
const upload = multer();
const router: Router = Router();
router.get("/", topicController.index);
router.get("/edit/:id",topicController.edit)
router.patch("/edit/:id",upload.single("avatar"),uploadCloudinary,topicController.editPatch)
export default router;