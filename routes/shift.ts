import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import ShiftController from "../controllers/ShiftController";
import CreateShiftValidation from "../validations/Shift/CreateShiftValidation";
import multer from "multer";
const upload = multer({ dest: "uploads/"});

const router = Router();

router.use(AuthMiddleware, EmailVerifiedMiddleware, RoleMiddleware(["Admin", "Head", "HRD"]));

router.get("/", ShiftController.getShifts);
router.post("/:organizationId/create", upload.any(),CreateShiftValidation, ShiftController.createShiftByOrganization);


export default router;
