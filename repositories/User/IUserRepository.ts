import { User } from "@prisma/client";


interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
}

export default IUserRepository;