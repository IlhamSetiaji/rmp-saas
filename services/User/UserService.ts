import UserRepository from "../../repositories/User/UserRepository";
import IUserService from "./IUserService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

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
        const token = jwt.sign(
            { email: user.email },
            'secretKeyForJWT', { expiresIn: '1d'}
        );
        return { tokenType: "Bearer", token, user: userWithoutPassword };
    };
}

export default UserService;
