import { Router } from "express";
import multer from "multer"
import * as songController from "../../controllers/admin/song-controller";
import * as uploadCloudinary from "../../middlewares/admin/upload-cloudinary";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
const router: Router = Router();
router.get("/", songController.index);
router.get("/detail/:id", songController.detail);
router.get("/create", songController.create);
router.post("/create", upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "audio", maxCount: 1 }
]), uploadCloudinary.uploadFields, songController.createPost);
router.get("/edit/:id", songController.edit);
router.patch("/edit/:id", upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "audio", maxCount: 1 }
]), uploadCloudinary.uploadFields, songController.editPatch);
export default router;