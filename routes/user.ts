import { Router } from "express";
import UserController from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";

const router = Router();

router.use(AuthMiddleware, EmailVerifiedMiddleware, RoleMiddleware(["Admin"]));
router.get("/", UserController.getAllUsers);

export default router;
