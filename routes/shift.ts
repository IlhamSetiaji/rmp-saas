import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import ShiftController from "../controllers/ShiftController";
import CreateShiftValidation from "../validations/Shift/CreateShiftValidation";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = Router();

router.use(
    AuthMiddleware,
    EmailVerifiedMiddleware,
    RoleMiddleware(["Admin", "Head", "HRD"])
);

router.get("/", ShiftController.getShifts);
router.post(
    "/:organizationId/create",
    upload.any(),
    CreateShiftValidation,
    ShiftController.createShiftByOrganization
);
router.get("/:organizationId/show", ShiftController.getShiftsByOrganization);
router.get("/:shiftId/detail", ShiftController.getShiftById);
router.put(
    "/:shiftId/update",
    upload.any(),
    CreateShiftValidation,
    ShiftController.updateShiftById
);
router.delete("/:shiftId/delete", ShiftController.deleteShiftById);

export default router;
