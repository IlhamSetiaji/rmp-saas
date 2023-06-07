import { EmailVerifyToken, User } from "@prisma/client";


interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    create(name: string, email: string, password: string): Promise<User>;
    insertEmailVerifyToken(email: string, token: string): Promise<any>;
    getEmailVerifyToken(email: string, token: string): Promise<any>;
    deleteEmailVerifyToken(token: string): Promise<EmailVerifyToken>;
    verifyUser(email: string): Promise<User>;
}

export default IUserRepository;