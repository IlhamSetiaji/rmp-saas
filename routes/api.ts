import { Router } from "express";
import UserController from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AdminMiddleware } from "../middlewares/AdminMiddleware";
import multer from "multer";
import LoginValidation from '../validations/User/LoginValidation';

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/login", upload.any(), LoginValidation, UserController.login);

router.use("/users", AuthMiddleware,  AdminMiddleware,
    router.get("/", UserController.getAllUsers),
);
export default router;
