import {Router} from "express";
import multer from "multer"
import * as songController from "../../controllers/admin/song-controller";
import { upload as uploadCloudinary } from "../../middlewares/admin/upload-cloudinary";
const upload = multer();
const router: Router = Router();
router.get("/", songController.index);
router.get("/detail/:id", songController.detail);
export default router;