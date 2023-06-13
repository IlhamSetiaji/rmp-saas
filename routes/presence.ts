import { Router } from "express";
import PresenceController from "../controllers/PresenceController";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import CreatePresenceValidation from "../validations/Presence/CreatePresenceValidation";

const router = Router();

router.use(
    AuthMiddleware,
    EmailVerifiedMiddleware,
    RoleMiddleware(["Admin", "Head", "HRD"])
);

router.get(
    "/",
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    PresenceController.getPresence
);
router.post(
    "/:shiftId/create",
    upload.any(),
    CreatePresenceValidation,
    PresenceController.createPresenceByShift
);
router.get(
    "/:shiftId/show",
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    PresenceController.getPresencesByShiftId
);
router.put(
    "/:presenceId/update",
    upload.any(),
    CreatePresenceValidation,
    PresenceController.updatePresenceById
);
router.delete(
    "/:presenceId/delete",
    PresenceController.deletePresenceById
);

export default router;
