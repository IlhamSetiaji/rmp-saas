import { Request, Response } from "express";
import UserService from "../services/User/UserService";
import ResponseFormatter from "../helpers/ResponseFormatter";

class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            return ResponseFormatter.success(res, users, 'Get all users success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await this.userService.login(email, password);
            return ResponseFormatter.success(res, user, 'Login success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    register = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            const user = await this.userService.register(name, email, password);
            return ResponseFormatter.success(res, user, 'Register success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    verifyEmail = async (req: Request, res: Response) => {
        try {
            const { email, token } = req.query;
            await this.userService.verifyEmail(email as string, token as string);
            return ResponseFormatter.success(res, null, 'Verify email success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    resendEmailVerification = async (req: Request, res: Response) => {
        try {
            const { email } = req.query;
            const token = await this.userService.resendEmailVerification(email as string);
            return ResponseFormatter.success(res, token, 'Resend email verification success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    sendPasswordResetToken = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const token = await this.userService.sendPasswordResetToken(email);
            return ResponseFormatter.success(res, token, 'Send password reset token success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { email, token } = req.query;
            const { password } = req.body;
            await this.userService.resetPassword(email as string, password, token as string);
            return ResponseFormatter.success(res, null, 'Reset password success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };
}

export default new UserController();
