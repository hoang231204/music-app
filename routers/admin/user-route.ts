import {Router} from "express";
import * as userController from "../../controllers/admin/user-controller";
const router: Router = Router();
router.get("/", userController.index);
router.get("/detail/:id", userController.detail);
export default router;