import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import ResponseFormatter from "../helpers/ResponseFormatter";

export const AuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            throw new Error("Token is required");
        }
        const decoded = jwt.verify(token, "secretKeyForJWT") as JwtPayload;
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error("Unauthenticated");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        req.currentUser = { ...userWithoutPassword, roles: user.roles.map((role) => role.role)};
        next();
    } catch (error: any) {
        return ResponseFormatter.error(res, error.message);
    }
};
