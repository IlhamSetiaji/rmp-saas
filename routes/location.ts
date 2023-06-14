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
    RoleMiddleware(["Admin"]),
    LocationController.getLocations
);

router.post(
    "/:organizationId/create",
    upload.any(),
    CreateLocationValidation,
    LocationController.createLocationByOrganization
);

router.get(
    "/:organizationId/show",
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    LocationController.getLocationsByOrganization
);

router.get(
    "/:locationId/detail",
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    LocationController.getLocationById
);

router.put(
    "/:locationId/update",
    upload.any(),
    CreateLocationValidation,
    LocationController.updateLocationById
);

router.delete(
    "/:locationId/delete",
    LocationController.deleteLocationById
);

export default router;
