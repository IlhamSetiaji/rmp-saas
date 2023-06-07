/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const main = async () => {
    const password = await bcrypt.hash("password", 10);

    const admin = await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@test.test",
            password,
        },
    });

    const hrd = await prisma.user.create({
        data: {
            name: "HRD",
            email: "hrd@test.test",
            password,
        },
    });

    const employee = await prisma.user.create({
        data: {
            name: "Employee",
            email: "employee@test.test",
            password,
        },
    });

    await prisma.role.createMany({
        data: [
            {
                name: "Admin",
            },
            {
                name: "HRD",
            },
            {
                name: "Employee",
            },
        ],
    });

    const roles = await prisma.role.findMany();

    roles.forEach(async (role: any): Promise<any> => {
        await prisma.userHasRole.createMany({
            data: [
                {
                    userId:
                        role.id === 1
                            ? admin.id
                            : role.id === 2
                            ? hrd.id
                            : employee.id,
                    roleId: role.id,
                },
            ],
        });
    });
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
