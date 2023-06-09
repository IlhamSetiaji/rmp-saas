import { Router } from "express";
import UserController from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { EmailVerifiedMiddleware } from "../middlewares/EmailVerifiedMiddleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import StoreUserValidation from "../validations/User/StoreUserValidation";
import UpdateMyProfileValidation from "../validations/User/UpdateMyProfileValidation";

const router = Router();

router.use(AuthMiddleware, EmailVerifiedMiddleware, RoleMiddleware(["Admin"]));
router.get("/", UserController.getAllUsers);
router.get("/:id/detail", UserController.getUserById);
router.get(
    "/me",
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    UserController.me
);
router.post(
    "/create-hrd",
    RoleMiddleware(["Admin", "Head"]),
    upload.any(),
    StoreUserValidation,
    UserController.createHrd
);
router.post(
    "/create-employee",
    RoleMiddleware(["Admin", "Head", "HRD"]),
    upload.any(),
    StoreUserValidation,
    UserController.createEmployee
);
router.put(
    "/update-my-profile",
    RoleMiddleware(["Admin", "Head", "HRD", "Employee"]),
    upload.any(),
    UpdateMyProfileValidation,
    UserController.updateMyProfile
);
router.get(
    "/head-of-department",
    RoleMiddleware(["Admin"]),
    UserController.getHeadOfDepartment
);
router.get(
    "/human-resource-department",
    RoleMiddleware(["Admin"]),
    UserController.getHumanResourceDepartment
);
router.get(
    "/employee",
    RoleMiddleware(["Admin"]),
    UserController.getEmployee
);

export default router;
