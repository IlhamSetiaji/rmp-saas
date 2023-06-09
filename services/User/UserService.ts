import UserRepository from "../../repositories/User/UserRepository";
import IUserService from "./IUserService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import transporter from "../../config/NodeMailer";
import crypto from "crypto";
import { CreateUserRequest } from "../../requests/User/CreateUserRequest";
import { UpdateMyProfileRequest } from "../../requests/User/UpdateMyProfileRequest";

class UserService implements IUserService {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    excludePassword = (user: User) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    };

    getAllUsers = async (): Promise<any[]> => {
        const users = await this.userRepository.getAllUsers();
        return users.map((user) => this.excludePassword(user));
    };

    login = async (email: string, password: string): Promise<any> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Email or password not found");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Email or password not found");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        const token = jwt.sign({ email: user.email }, "secretKeyForJWT", {
            expiresIn: "1d",
        });
        return { tokenType: "Bearer", token, user: userWithoutPassword };
    };

    register = async (
        name: string,
        email: string,
        password: string
    ): Promise<any> => {
        const user = await this.userRepository.findByEmail(email);
        if (user) {
            throw new Error("User already registered");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userRepository.create(
            name,
            email,
            hashedPassword
        );
        setTimeout(async () => {
            const token = await this.generateEmailVerifyToken(newUser.email);
            await this.sendEmailVerification(newUser.email, token);
        }, 1000);
        return this.excludePassword(newUser);
    };

    generateEmailVerifyToken = async (email: string): Promise<string> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const token = crypto.randomBytes(64).toString("hex");
        await this.userRepository.insertEmailVerifyToken(user.email, token);
        return token;
    };

    sendEmailVerification = async (
        email: string,
        token: string
    ): Promise<any> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const mailOptions = {
            from: "ilham.ahmadz18@gmail.com",
            to: user.email,
            subject: "Email Verification",
            html: `<p>Click <a href="http://localhost:3000/api/verify-email?email=${user.email}&token=${token}">here</a> to verify your email</p>
            <p>Or copy this link to your browser: http://localhost:3000/api/verify-email?email=${user.email}&token=${token}</p>`,
        };
        await transporter.sendMail(mailOptions);
        return true;
    };

    resendEmailVerification = async (email: string): Promise<any> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        if (user.emailVerifiedAt) {
            throw new Error("Email already verified");
        }
        const token = crypto.randomBytes(64).toString("hex");
        await this.userRepository.insertEmailVerifyToken(user.email, token);
        const mailOptions = {
            from: "ilham.ahmadz18@gmail.com",
            to: user.email,
            subject: "Email Verification",
            html: `<p>Click <a href="http://localhost:3000/api/verify-email?email=${user.email}&token=${token}">here</a> to verify your email</p>
            <p>Or copy this link to your browser: http://localhost:3000/api/verify-email?email=${user.email}&token=${token}</p>`,
        };
        setTimeout(async () => {
            await transporter.sendMail(mailOptions);
        }, 1000);
        return user;
    };

    verifyEmail = async (email: string, token: string): Promise<any> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        if (user.emailVerifiedAt) {
            throw new Error("Email already verified");
        }
        const emailVerifyToken = await this.userRepository.getEmailVerifyToken(
            user.email,
            token
        );
        if (!emailVerifyToken) {
            throw new Error("Token is invalid or expired");
        }
        await this.userRepository.verifyUser(email);
        await this.userRepository.deleteEmailVerifyToken(token);
        return true;
    };

    generatePasswordResetToken = async (email: string): Promise<string> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const token = crypto.randomBytes(64).toString("hex");
        await this.userRepository.insertPasswordResetToken(user.email, token);
        return token;
    };

    sendPasswordResetToken = async (email: string): Promise<any> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const token = await this.generatePasswordResetToken(user.email);
        const mailOptions = {
            from: "ilham.ahmadz18@gmail.com",
            to: user.email,
            subject: "Reset Password",
            html: `<p>Click <a href="http://localhost:3000/api/reset-password?email=${user.email}&token=${token}">here</a> to reset your password</p>
            <p>Or copy this link to your browser: http://localhost:3000/api/reset-password?email=${user.email}&token=${token}</p>`,
        };
        setTimeout(async () => {
            await transporter.sendMail(mailOptions);
        }, 1000);
        return this.excludePassword(user);
    };

    resetPassword = async (
        email: string,
        password: string,
        token: string
    ): Promise<any> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const passwordResetToken =
            await this.userRepository.getPasswordResetToken(user.email, token);
        if (!passwordResetToken) {
            throw new Error("Token is invalid or expired");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.updatePassword(email, hashedPassword);
        await this.userRepository.deletePasswordResetToken(token);
        return true;
    };

    createHrd = async (user: CreateUserRequest): Promise<User> => {
        const userExist = await this.userRepository.findByEmail(user.email);
        if (userExist) {
            throw new Error("User already registered");
        }
        user.password = await bcrypt.hash(user.password, 10);
        delete user.password_confirmation;
        return await this.userRepository.createHrd(user);
    };

    getUserById = async (id: number): Promise<User | null> => {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    };

    createEmployee = async (user: CreateUserRequest): Promise<User> => {
        const userExist = await this.userRepository.findByEmail(user.email);
        if (userExist) {
            throw new Error("User already registered");
        }
        user.password = await bcrypt.hash(user.password, 10);
        delete user.password_confirmation;
        return await this.userRepository.createEmployee(user);
    };

    updateMyProfile = async (
        payload: UpdateMyProfileRequest,
        id: number
    ): Promise<User> => {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return await this.userRepository.updateMyProfile(payload, id);
    };

    getHeadOfDepartment = async (): Promise<User[]> => {
        const users = await this.userRepository.getHeadOfDepartment();
        return users;
    };

    getHumanResourceDepartment = async (): Promise<User[]> => {
        const users = await this.userRepository.getHumanResourceDepartment();
        return users;
    };

    getEmployee = async (): Promise<User[]> => {
        const users = await this.userRepository.getEmployee();
        return users;
    };

    getHeadOfDepartmentInOrganization = async (
        organizationId: number
    ): Promise<User[]> => {
        const users =
            await this.userRepository.getHeadOfDepartmentInOrganization(
                organizationId
            );
        return users;
    };

    getHumanResourceDepartmentInOrganization = async (
        organizationId: number
    ): Promise<User[]> => {
        const users =
            await this.userRepository.getHumanResourceDepartmentInOrganization(
                organizationId
            );
        return users;
    };

    getEmployeeInOrganization = async (
        organizationId: number
    ): Promise<User[]> => {
        const users =
            await this.userRepository.getEmployeeInOrganization(organizationId);
        return users;
    };
}

export default UserService;
