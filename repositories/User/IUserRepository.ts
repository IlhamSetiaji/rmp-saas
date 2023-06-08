import { EmailVerifyToken, User } from "@prisma/client";
import { CreateUserRequest } from "../../requests/User/CreateUserRequest";
import { UpdateMyProfileRequest } from "../../requests/User/UpdateMyProfileRequest";


interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    create(name: string, email: string, password: string): Promise<User>;
    insertEmailVerifyToken(email: string, token: string): Promise<any>;
    getEmailVerifyToken(email: string, token: string): Promise<any>;
    deleteEmailVerifyToken(token: string): Promise<EmailVerifyToken>;
    verifyUser(email: string): Promise<User>;
    insertPasswordResetToken(email: string, token: string): Promise<any>;
    getPasswordResetToken(email: string, token: string): Promise<any>;
    deletePasswordResetToken(token: string): Promise<any>;
    updatePassword(email: string, password: string): Promise<any>;
    createHrd(user: CreateUserRequest): Promise<any>;
    getUserById(id: number): Promise<User | null>;
    createEmployee(user: CreateUserRequest): Promise<any>;
    updateMyProfile(payload: UpdateMyProfileRequest, id: number): Promise<any>;
}

export default IUserRepository;