import { User } from "@prisma/client";
import { CreateUserRequest } from "../../requests/User/CreateUserRequest";
import { UpdateMyProfileRequest } from "../../requests/User/UpdateMyProfileRequest";

interface IUserService {
    excludePassword(user: User): any;
    getAllUsers(): Promise<any[]>;
    login(email: string, password: string): Promise<any>;
    register(name: string, email: string, password: string): Promise<any>;
    generateEmailVerifyToken(email: string): Promise<string>;
    sendEmailVerification(email: string, token: string): Promise<any>;
    resendEmailVerification(email: string): Promise<any>;
    verifyEmail(email: string, token: string): Promise<any>;
    generatePasswordResetToken(email: string): Promise<string>;
    sendPasswordResetToken(email: string): Promise<any>;
    resetPassword(email: string, password: string, token: string): Promise<any>;
    createHrd(user: CreateUserRequest): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    createEmployee(user: CreateUserRequest): Promise<User>;
    updateMyProfile(payload: UpdateMyProfileRequest, id: number): Promise<User>;
}

export default IUserService;
