import {Router} from "express";
import multer from "multer"
import * as accountController from "../../controllers/admin/account-controller";
import * as uploadCloudinary from "../../middlewares/admin/upload-cloudinary";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 
  }
});
const router: Router = Router();
router.get("/", accountController.index);
router.get("/create", accountController.create);
router.post("/create", upload.single("avatar"), uploadCloudinary.uploadSingle, accountController.createPost);
router.get("/edit/:id", accountController.edit);
router.patch("/edit/:id", upload.single("avatar"), uploadCloudinary.uploadSingle, accountController.editPatch);
router.delete("/delete/:id", accountController.deleteAccount);
export default router;