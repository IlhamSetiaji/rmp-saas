import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

export const AdminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const prisma = new PrismaClient();
        const { user } = req.body;
        const userRole = await prisma.userHasRole.findFirst({
            where: {
                userId: user.id,
                roleId: 1,
            },
        });
        if (!userRole) {
            throw new Error('Unauthorized');
        }
        next();
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};