import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../helpers/ResponseFormatter";

export const EmailVerifiedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.currentUser;
        // console.log(user);
        if (!user.emailVerifiedAt) {
            throw new Error("Email not verified");
        }
        next();
    } catch (error: any) {
        return ResponseFormatter.error(res, error.message);
    }
};