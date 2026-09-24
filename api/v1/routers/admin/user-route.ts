import {Router} from "express";
import * as userController from "../../controllers/admin/user-controller";
import { requirePermission } from "../../middlewares/admin/require-permission";
const router: Router = Router();
router.get("/", requirePermission("user_view"), userController.index);
router.get("/detail/:id", requirePermission("user_view"), userController.detail);
router.patch("/change-status/:id", requirePermission("user_edit"), userController.changeStatus);
router.delete("/delete/:id", requirePermission("user_delete"), userController.deleteUser);
export default router;