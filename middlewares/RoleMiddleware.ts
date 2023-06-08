import { Request, Response, NextFunction } from "express";

export const RoleMiddleware = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUser = req.currentUser;
            if(!currentUser) {
                throw new Error("Unauthenticated");
            }
            const userRole = currentUser.roles.find((role: { name: string; }) => roles.includes(role.name));
            if (!userRole) {
                throw new Error("Unauthorized");
            }
            next();
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    };
};