import { CreateUserRequest } from "../../requests/User/CreateUserRequest";
import { UpdateMyProfileRequest } from "../../requests/User/UpdateMyProfileRequest";
import IUserRepository from "./IUserRepository";
import { User, PrismaClient, EmailVerifyToken } from "@prisma/client";

class UserRepository implements IUserRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    getAllUsers = async (): Promise<User[]> => {
        const users = await this.prisma.user.findMany({
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                }
            }
        });

        return users.map((user) => {
            return { ...user, roles: user.roles.map((role) => role.role)} as User;
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
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password,
                roles: {
                    create: {
                        roleId: 2,
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
        return { ...user, roles: user.roles.map((role) => role.role)} as User;
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

    createHrd = async (user: CreateUserRequest): Promise<any> => {
        return await this.prisma.user.create({
            data: {
                ...user,
                emailVerifiedAt: new Date(),
                roles: {
                    create: {
                        roleId: 3,
                    }
                }
            }
        });
    };

    getUserById = async (id: number): Promise<User | null> => {
        return await this.prisma.user.findUnique({
            where: { id },
            include: {
                roles: {
                    include: {
                        role: true,
                    }
                }
            }
        });
    };

    createEmployee = async (user: CreateUserRequest): Promise<any> => {
        return await this.prisma.user.create({
            data: {
                ...user,
                emailVerifiedAt: new Date(),
                roles: {
                    create: {
                        roleId: 4,
                    }
                }
            }
        });
    };

    updateMyProfile = async (payload: UpdateMyProfileRequest, id: number): Promise<any> => {
        return await this.prisma.user.update({
            where: {
                id: +id,
            },
            data: {
                ...payload,
            }
        });
    };

    getHeadOfDepartment = async (): Promise<User[]> => {
        const users = await this.prisma.user.findMany({
            where: {
                roles: {
                    some: {
                        roleId: 2,
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

        return users.map((user) => {
            return { ...user, roles: user.roles.map((role) => role.role)} as User;
        });
    };

    getHumanResourceDepartment = async (): Promise<User[]> => {
        const users = await this.prisma.user.findMany({
            where: {
                roles: {
                    some: {
                        roleId: 3,
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

        return users.map((user) => {
            return { ...user, roles: user.roles.map((role) => role.role)} as User;
        });
    };

    getEmployee = async (): Promise<User[]> => {
        const users = await this.prisma.user.findMany({
            where: {
                roles: {
                    some: {
                        roleId: 4,
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

        return users.map((user) => {
            return { ...user, roles: user.roles.map((role) => role.role)} as User;
        });
    };

    getHeadOfDepartmentInOrganization = async (organizationId: number): Promise<User[]> => {
        const users = await this.prisma.user.findMany({
            where: {
                organizations:{
                    some: {
                        organization: {
                            id: organizationId,
                        }
                    }
                },
                roles: {
                    some: {
                        role: {
                            id: 2,
                        }
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

        return users.map((user) => {
            return { ...user, roles: user.roles.map((role) => role.role)} as User;
        });
    };

    getHumanResourceDepartmentInOrganization = async (organizationId: number): Promise<User[]> => {
        const users = await this.prisma.user.findMany({
            where: {
                organizations:{
                    some: {
                        organization: {
                            id: organizationId,
                        }
                    }
                },
                roles: {
                    some: {
                        roleId: 3,
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

        return users.map((user) => {
            return { ...user, roles: user.roles.map((role) => role.role)} as User;
        });
    };

    getEmployeeInOrganization = async (organizationId: number): Promise<User[]> => {
        const users = await this.prisma.user.findMany({
            where: {
                organizations:{
                    some: {
                        organizationId,
                    }
                },
                roles: {
                    some: {
                        roleId: 4,
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

        return users.map((user) => {
            return { ...user, roles: user.roles.map((role) => role.role)} as User;
        });
    };
}

export default UserRepository;
