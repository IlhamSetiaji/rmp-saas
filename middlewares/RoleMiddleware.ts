import { Request, Response, NextFunction } from "express";

export const RoleMiddleware = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user } = req.body;
            if(!user) {
                throw new Error("Unauthenticated");
            }
            const userRole = user.roles.find((role: { role: { name: string; }; }) => roles.includes(role.role.name));
            if (!userRole) {
                throw new Error("Unauthorized");
            }
            next();
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    };
};