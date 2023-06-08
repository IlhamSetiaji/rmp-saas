export type CreateUserRequest = {
    name: string;
    email: string;
    password: string;
    phone: string;
    password_confirmation?: string;
};
