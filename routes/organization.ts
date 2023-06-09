import { Router } from "express";
import OrganizationController from "../controllers/OrganizationController";
import UserController from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import CreateOrganizationValidation from "../validations/Organization/CreateOrganizationValidation";
import AssignUsersToOrganizationValidation from "../validations/Organization/AssignUsersToOrganizationValidation";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

const router = Router();

router.use(AuthMiddleware, EmailVerifiedMiddleware);

/* This is just test */
router.get("/test", (req, res) => {
    // const currentUser = req.currentUser;
    // const roles = ["Admin", "Head", "HRD", "Employee"];
    // const userRole = currentUser.roles.find((role: { name: string }) =>
    //     roles.includes(role.name)
    // );
    // res.json({ userRole });
    res.send(new Date().toDateString() + " " + new Date().toTimeString());
});
/* Don't forget to remove this code before deployment */

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
router.get(
    "/:id/hod",
    RoleMiddleware(["Admin"]),
    UserController.getHeadOfDepartmentInOrganization
);
router.get(
    "/:id/hrd",
    RoleMiddleware(["Admin", "Head"]),
    UserController.getHumanResourceDepartmentInOrganization
);
router.get(
    "/:id/employee",
    RoleMiddleware(["Admin","Head", "HRD"]),
    UserController.getEmployeeInOrganization
);
router.get(
    "/:id/assign-myself",
    RoleMiddleware(["Admin", "Head"]),
    OrganizationController.assignMyselfToOrganization
);

export default router;
