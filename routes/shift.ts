import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import ShiftController from "../controllers/ShiftController";
import CreateShiftValidation from "../validations/Shift/CreateShiftValidation";
import AssignUsersToShiftValidation from "../validations/Shift/AssignUsersToShiftValidation";
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
router.post(
    "/:shiftId/assign",
    upload.any(),
    AssignUsersToShiftValidation,
    ShiftController.assignEmployeesToShift
);
router.get("/:shiftId/users", ShiftController.getUsersByShiftId);
router.post(
    "/:shiftId/resign",
    upload.any(),
    AssignUsersToShiftValidation,
    ShiftController.resignEmployeesFromShift
);

export default router;
