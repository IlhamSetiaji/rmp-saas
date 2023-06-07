import IUserRepository from "./IUserRepository";
import { User, PrismaClient } from "@prisma/client";

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
}

export default UserRepository;
