import {Router} from "express";
import multer from "multer"
import * as topicController from "../../controllers/admin/topic-controller";
import * as uploadCloudinary from "../../middlewares/admin/upload-cloudinary";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 
  }
});
const router: Router = Router();
router.get("/", topicController.index);
router.get("/edit/:id",topicController.edit)
router.patch("/edit/:id",upload.single("avatar"),uploadCloudinary.uploadSingle,topicController.editPatch)
router.get("/create",topicController.create)
router.post("/create",upload.single("avatar"),uploadCloudinary.uploadSingle,topicController.createPost)
router.patch("/change-multi",topicController.changeMulti)
router.delete("/delete/:id",topicController.deleteTopic)
export default router;