import {Router} from "express";
import multer from "multer"
import * as singerController from "../../controllers/admin/singer-controller";
import * as uploadCloudinary from "../../middlewares/admin/upload-cloudinary";
import { requirePermission } from "../../middlewares/admin/require-permission";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 
  }
});
const router: Router = Router();
router.get("/", requirePermission("singer_view"), singerController.index);
router.get("/create", requirePermission("singer_create"), singerController.create);
router.post("/create", requirePermission("singer_create"), upload.single("avatar"), uploadCloudinary.uploadSingle, singerController.createPost);
router.get("/edit/:id", requirePermission("singer_edit"), singerController.edit);
router.patch("/edit/:id", requirePermission("singer_edit"), upload.single("avatar"), uploadCloudinary.uploadSingle, singerController.editPatch);
router.patch("/change-multi", requirePermission("singer_edit"), singerController.changeMulti);
router.delete("/delete/:id", requirePermission("singer_delete"), singerController.deleteSinger);
export default router;