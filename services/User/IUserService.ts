import { User } from "@prisma/client";

interface IUserService {
    excludePassword(user: User): any;
    getAllUsers(): Promise<any[]>;
    login(email: string, password: string): Promise<any>;
    register(name: string, email: string, password: string): Promise<any>;
    generateEmailVerifyToken(email: string): Promise<string>;
    sendEmailVerification(email: string, token: string): Promise<any>;
    resendEmailVerification(email: string): Promise<any>;
    verifyEmail(email: string, token: string): Promise<any>;
}

export default IUserService;
