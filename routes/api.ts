import { Router } from "express";
import user from "./user";
import organization from "./organization";
import UserController from "../controllers/UserController";
import multer from "multer";
import LoginValidation from "../validations/User/LoginValidation";
import RegisterValidation from "../validations/User/RegisterValidation";
import ForgotPasswordValidation from "../validations/User/ForgotPasswordValidation";
import ResetPasswordValidation from "../validations/User/ResetPasswordValidation";
import shift from "./shift";
import test from "./test";
import presence from "./presence";
import location from "./location";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/login", upload.any(), LoginValidation, UserController.login);
router.post(
    "/register",
    upload.any(),
    RegisterValidation,
    UserController.register
);
router.get("/verify-email", UserController.verifyEmail);
router.get(
    "/resend-email-verification",
    UserController.resendEmailVerification
);
router.post(
    "/forgot-password",
    upload.any(),
    ForgotPasswordValidation,
    UserController.sendPasswordResetToken
);
router.post(
    "/reset-password",
    upload.any(),
    ResetPasswordValidation,
    UserController.resetPassword
);

router.use("/users", user);
router.use("/organizations", organization);
router.use("/shifts", shift);
router.use("/presences", presence);
router.use("/locations", location);
router.use("/test", test);

export default router;
