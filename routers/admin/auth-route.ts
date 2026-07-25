import {Router} from "express";
import * as authController from "../../controllers/admin/auth-controller";
const router: Router = Router();
router.get("/login", authController.login);
export default router;