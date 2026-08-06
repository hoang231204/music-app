import {Router} from "express";
import * as roleController from "../../controllers/admin/role-controller";
const router: Router = Router();
router.get("/", roleController.index);

export default router;