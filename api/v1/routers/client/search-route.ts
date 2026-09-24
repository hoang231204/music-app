import {Router} from "express";
import * as searchController from "../../controllers/client/search-controller";
const router = Router();
router.get("/", searchController.index);
export default router;