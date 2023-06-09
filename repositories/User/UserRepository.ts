import { CreateUserRequest } from "../../requests/User/CreateUserRequest";
import { UpdateMyProfileRequest } from "../../requests/User/UpdateMyProfileRequest";
import IUserRepository from "./IUserRepository";
import { User, PrismaClient, EmailVerifyToken } from "@prisma/client";
import dayjs from "dayjs";
import { hour } from "../../config/timezone";

class UserRepository implements IUserRepository {
    private prisma: PrismaClient;
    private now: Date;
    private timestamps: any;
    constructor() {
        this.prisma = new PrismaClient();
        this.now = dayjs().add(hour, 'hour').toDate();
        this.timestamps = {
            createdAt: this.now,
            updatedAt: this.now,
        };
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
                ...this.timestamps,
                roles: {
                    create: {
                        roleId: 2,
                        ...this.timestamps,
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
                expiredAt: dayjs().add(8, 'hour').toDate(),
                ...this.timestamps,
            }
        });
    };

    getEmailVerifyToken = async (email: string, token: string): Promise<any> => {
        return await this.prisma.emailVerifyToken.findFirst({
            where: {
                email,
                token,
                expiredAt: {
                    gte: this.now,
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
                emailVerifiedAt: this.now,
            }
        });
    };

    insertPasswordResetToken = async (email: string, token: string): Promise<any> => {
        return await this.prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expiredAt: dayjs().add(8, 'hour').toDate(),
                ...this.timestamps,
            }
        });
    };

    getPasswordResetToken = async (email: string, token: string): Promise<any> => {
        return await this.prisma.passwordResetToken.findFirst({
            where: {
                email,
                token,
                expiredAt: {
                    gte: this.now,
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
                updatedAt: this.now,
            }
        });
    };

    createHrd = async (user: CreateUserRequest): Promise<any> => {
        return await this.prisma.user.create({
            data: {
                ...user,
                emailVerifiedAt: new Date(),
                ...this.timestamps,
                roles: {
                    create: {
                        roleId: 3,
                        ...this.timestamps,
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
                ...this.timestamps,
                roles: {
                    create: {
                        roleId: 4,
                        ...this.timestamps,
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
                updatedAt: this.now,
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
