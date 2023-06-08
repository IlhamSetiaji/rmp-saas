import { Router } from "express";
import UserController from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AdminMiddleware } from "../middlewares/AdminMiddleware";

const router = Router();

router.use(AuthMiddleware, AdminMiddleware);
router.get('/', UserController.getAllUsers);

export default router;