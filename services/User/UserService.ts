import UserRepository from "../../repositories/User/UserRepository";
import IUserService from "./IUserService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import transporter from "../../config/NodeMailer";
import crypto from "crypto";

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
        if(user.emailVerifiedAt) {
            throw new Error("Email already verified");
        }
        const emailVerifyToken = await this.userRepository.getEmailVerifyToken(
            user.email, token
        );
        if (!emailVerifyToken) {
            throw new Error("Token is invalid or expired");
        }
        await this.userRepository.verifyUser(email);
        await this.userRepository.deleteEmailVerifyToken(token);
        return true;
    };
}

export default UserService;
