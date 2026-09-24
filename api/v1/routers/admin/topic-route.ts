import {Router} from "express";
import multer from "multer"
import * as topicController from "../../controllers/admin/topic-controller";
import * as uploadCloudinary from "../../middlewares/admin/upload-cloudinary";
import { requirePermission } from "../../middlewares/admin/require-permission";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 
  }
});
const router: Router = Router();
router.get("/", requirePermission("topic_view"), topicController.index);
router.get("/edit/:id", requirePermission("topic_edit"), topicController.edit);
router.patch("/edit/:id", requirePermission("topic_edit"), upload.single("avatar"), uploadCloudinary.uploadSingle, topicController.editPatch);
router.get("/create", requirePermission("topic_create"), topicController.create);
router.post("/create", requirePermission("topic_create"), upload.single("avatar"), uploadCloudinary.uploadSingle, topicController.createPost);
router.patch("/change-multi", requirePermission("topic_edit"), topicController.changeMulti);
router.delete("/delete/:id", requirePermission("topic_delete"), topicController.deleteTopic);
export default router;