import { Router } from "express";
import OrganizationController from "../controllers/OrganizationController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AdminMiddleware } from "../middlewares/AdminMiddleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import CreateOrganizationValidation from "../validations/Organization/CreateOrganizationValidation";
import AssignUsersToOrganizationValidation from "../validations/Organization/AssignUsersToOrganizationValidation";

const router = Router();

router.use(AuthMiddleware, AdminMiddleware);

router.get("/", OrganizationController.getAllOrganizations);
router.get("/:id/detail", OrganizationController.getOrganizationById);
router.post(
    "/",
    upload.any(),
    CreateOrganizationValidation,
    OrganizationController.createOrganization
);
router.post(
    "/:id/assign-users",
    upload.any(),
    AssignUsersToOrganizationValidation,
    OrganizationController.assignUsersToOrganization
);

export default router;
