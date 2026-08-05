import {Router} from "express";
import multer from "multer"
import * as singerController from "../../controllers/admin/singer-controller";
import { upload as uploadCloudinary } from "../../middlewares/admin/upload-cloudinary";
const upload = multer();
const router: Router = Router();
router.get("/", singerController.index);

export default router;