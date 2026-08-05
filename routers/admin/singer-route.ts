import {Router} from "express";
import multer from "multer"
import * as singerController from "../../controllers/admin/singer-controller";
import { upload as uploadCloudinary } from "../../middlewares/admin/upload-cloudinary";
const upload = multer();
const router: Router = Router();
router.get("/", singerController.index);
router.get("/create", singerController.create);
router.post("/create", upload.single("avatar"), uploadCloudinary, singerController.createPost);
router.get("/edit/:id", singerController.edit);
router.patch("/edit/:id", upload.single("avatar"), uploadCloudinary, singerController.editPatch);
router.patch("/change-multi", singerController.changeMulti);
export default router;