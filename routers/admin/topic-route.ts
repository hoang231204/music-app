import {Router} from "express";
import multer from "multer"
import * as topicController from "../../controllers/admin/topic-controller";
import { upload as uploadCloudinary } from "../../middlewares/admin/upload-cloudinary";
const upload = multer();
const router: Router = Router();
router.get("/", topicController.index);
router.get("/edit/:id",topicController.edit)
router.patch("/edit/:id",upload.single("avatar"),uploadCloudinary,topicController.editPatch)
router.get("/create",topicController.create)
router.post("/create",upload.single("avatar"),uploadCloudinary,topicController.createPost)
router.patch("/change-multi",topicController.changeMulti)
router.delete("/delete/:id",topicController.deleteTopic)
export default router;