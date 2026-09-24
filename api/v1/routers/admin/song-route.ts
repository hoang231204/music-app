import { Router } from "express";
import multer from "multer"
import * as songController from "../../controllers/admin/song-controller";
import * as uploadCloudinary from "../../middlewares/admin/upload-cloudinary";
import { requirePermission } from "../../middlewares/admin/require-permission";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
const router: Router = Router();
router.get("/", requirePermission("song_view"), songController.index);
router.get("/detail/:id", requirePermission("song_view"), songController.detail);
router.get("/create", requirePermission("song_create"), songController.create);
router.post("/create", requirePermission("song_create"), upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "audio", maxCount: 1 }
]), uploadCloudinary.uploadFields, songController.createPost);
router.get("/edit/:id", requirePermission("song_edit"), songController.edit);
router.patch("/edit/:id", requirePermission("song_edit"), upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "audio", maxCount: 1 }
]), uploadCloudinary.uploadFields, songController.editPatch);
router.patch("/change-multi", requirePermission("song_edit"), songController.changeMulti);
router.delete("/delete/:id", requirePermission("song_delete"), songController.deleteSong);
export default router;