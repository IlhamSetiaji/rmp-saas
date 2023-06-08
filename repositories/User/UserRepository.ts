import IUserRepository from "./IUserRepository";
import { User, PrismaClient, EmailVerifyToken } from "@prisma/client";

class UserRepository implements IUserRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    getAllUsers = async (): Promise<User[]> => {
        return await this.prisma.user.findMany({
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                }
            }
        });
    };

    findByEmail = async (email: string): Promise<User | null> => {
        return await this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                }
            }
        });
    };

    create = async (name: string, email: string, password: string): Promise<User> => {
        return await this.prisma.user.create({
            data: {
                name,
                email,
                password,
                roles: {
                    create: {
                        roleId: 1,
                    }
                }
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                }
            }
        });
    };

    insertEmailVerifyToken = async (email: string, token: string): Promise<any> => {
        return await this.prisma.emailVerifyToken.create({
            data: {
                email,
                token,
                expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
        });
    };

    getEmailVerifyToken = async (email: string, token: string): Promise<any> => {
        return await this.prisma.emailVerifyToken.findFirst({
            where: {
                email,
                token,
                expiredAt: {
                    gte: new Date(),
                }
            }
        });
    };

    deleteEmailVerifyToken = async (token: string): Promise<EmailVerifyToken> => {
        return await this.prisma.emailVerifyToken.delete({
            where: {
                token,
            }
        });
    };

    verifyUser = async (email: string): Promise<User> => {
        return await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                emailVerifiedAt: new Date(),
            }
        });
    };

    insertPasswordResetToken = async (email: string, token: string): Promise<any> => {
        return await this.prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
        });
    };

    getPasswordResetToken = async (email: string, token: string): Promise<any> => {
        return await this.prisma.passwordResetToken.findFirst({
            where: {
                email,
                token,
                expiredAt: {
                    gte: new Date(),
                }
            }
        });
    };

    deletePasswordResetToken = async (token: string): Promise<any> => {
        return await this.prisma.passwordResetToken.delete({
            where: {
                token,
            }
        });
    };

    updatePassword = async (email: string, password: string): Promise<any> => {
        return await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                password,
            }
        });
    };
}

export default UserRepository;
