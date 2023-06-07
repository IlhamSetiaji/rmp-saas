import { User } from "@prisma/client";

interface IUserService {
    excludePassword(user: User): any;
    getAllUsers(): Promise<any[]>;
    login(email: string, password: string): Promise<any>;
}

export default IUserService;
