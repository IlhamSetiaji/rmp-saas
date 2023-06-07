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
}

export default new UserController();
