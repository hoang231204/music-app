import {Router} from "express";
import * as authController from "../../controllers/admin/auth-controller";
const router: Router = Router();
router.get("/login", authController.login);
router.post("/login", authController.loginPost);
router.get("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
export default router;