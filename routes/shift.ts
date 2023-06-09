import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import ShiftController from "../controllers/ShiftController";

const router = Router();

router.use(AuthMiddleware, EmailVerifiedMiddleware);

router.use(
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    router.get("/", ShiftController.getShifts)
);

export default router;
