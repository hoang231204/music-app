import {Router} from "express";
import multer from "multer"
import * as accountController from "../../controllers/admin/account-controller";
import * as uploadCloudinary from "../../middlewares/admin/upload-cloudinary";
import { requirePermission } from "../../middlewares/admin/require-permission";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 
  }
});
const router: Router = Router();
router.get("/", requirePermission("account_view"), accountController.index);
router.get("/create", requirePermission("account_create"), accountController.create);
router.post("/create", requirePermission("account_create"), upload.single("avatar"), uploadCloudinary.uploadSingle, accountController.createPost);
router.get("/edit/:id", requirePermission("account_edit"), accountController.edit);
router.patch("/edit/:id", requirePermission("account_edit"), upload.single("avatar"), uploadCloudinary.uploadSingle, accountController.editPatch);
router.delete("/delete/:id", requirePermission("account_delete"), accountController.deleteAccount);
export default router;