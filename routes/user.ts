import { Router } from "express";
import UserController from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AdminMiddleware } from "../middlewares/AdminMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";

const router = Router();

router.use(AuthMiddleware, EmailVerifiedMiddleware, AdminMiddleware);
router.get("/", UserController.getAllUsers);

export default router;
