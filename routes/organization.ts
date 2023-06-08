import { Router } from "express";
import OrganizationController from "../controllers/OrganizationController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import CreateOrganizationValidation from "../validations/Organization/CreateOrganizationValidation";
import AssignUsersToOrganizationValidation from "../validations/Organization/AssignUsersToOrganizationValidation";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

const router = Router();

router.use(AuthMiddleware, EmailVerifiedMiddleware, RoleMiddleware(["Admin"]));

router.get("/", OrganizationController.getAllOrganizations);
router.get("/:id/detail", OrganizationController.getOrganizationById);
router.post(
    "/",
    upload.any(),
    CreateOrganizationValidation,
    OrganizationController.createOrganization
);
router.put(
    "/:id/update",
    upload.any(),
    CreateOrganizationValidation,
    OrganizationController.updateOrganization
);
router.post(
    "/:id/assign-users",
    RoleMiddleware(["Head", "Admin"]),
    upload.any(),
    AssignUsersToOrganizationValidation,
    OrganizationController.assignUsersToOrganization
);
router.post(
    "/:id/resign-users",
    RoleMiddleware(["Head", "Admin"]),
    upload.any(),
    AssignUsersToOrganizationValidation,
    OrganizationController.resignUsersFromOrganization
);
router.delete("/:id/delete", OrganizationController.deleteOrganization);

export default router;
