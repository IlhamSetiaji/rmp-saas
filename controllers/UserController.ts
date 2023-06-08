import { Request, Response } from "express";
import UserService from "../services/User/UserService";
import ResponseFormatter from "../helpers/ResponseFormatter";
import { CreateUserRequest } from "../requests/User/CreateUserRequest";
import { UpdateMyProfileRequest } from "../requests/User/UpdateMyProfileRequest";

class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    me = async (req: Request, res: Response) => {
        try {
            const user = req.currentUser;
            return ResponseFormatter.success(res, user, 'Get my profile success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            return ResponseFormatter.success(res, users, 'Get all users success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(parseInt(id));
            return ResponseFormatter.success(res, user, 'Get user by id success');
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

    createHrd = async (req: Request, res: Response) => {
        try {
            const payload: CreateUserRequest = req.body;
            const hrd = await this.userService.createHrd(payload);
            return ResponseFormatter.success(res, hrd, 'Create HRD success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    createEmployee = async (req: Request, res: Response) => {
        try {
            const payload: CreateUserRequest = req.body;
            const employee = await this.userService.createEmployee(payload);
            return ResponseFormatter.success(res, employee, 'Create employee success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    updateMyProfile = async (req: Request, res: Response) => {
        try {
            const payload: UpdateMyProfileRequest = req.body;
            const { id } = req.currentUser;
            const user = await this.userService.updateMyProfile(payload, id);
            return ResponseFormatter.success(res, user, 'Update my profile success');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };
}

export default new UserController();
