import { Router } from "express";
import UserController from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AdminMiddleware } from "../middlewares/AdminMiddleware";
import multer from "multer";
import LoginValidation from "../validations/User/LoginValidation";
import RegisterValidation from "../validations/User/RegisterValidation";
import ForgotPasswordValidation from "../validations/User/ForgotPasswordValidation";
import ResetPasswordValidation from "../validations/User/ResetPasswordValidation";

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
router.post("/forgot-password", upload.any(), ForgotPasswordValidation, UserController.sendPasswordResetToken);
router.post("/reset-password", upload.any(), ResetPasswordValidation, UserController.resetPassword);

router.use(
    "/users",
    AuthMiddleware,
    AdminMiddleware,
    router.get("/", UserController.getAllUsers)
);
export default router;
