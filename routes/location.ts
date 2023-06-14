import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import LocationController from "../controllers/LocationController";
import CreateLocationValidation from "../validations/Location/CreateLocationValidation";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = Router();

router.use(
    AuthMiddleware,
    EmailVerifiedMiddleware,
    RoleMiddleware(["Admin", "Head", "HRD"])
);

router.get(
    "/",
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    LocationController.getLocations
);

router.post(
    "/:organizationId/create",
    RoleMiddleware(["Admin", "Head", "HRD"]),
    upload.any(),
    CreateLocationValidation,
    LocationController.createLocationByOrganization
);

export default router;
