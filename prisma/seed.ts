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
            emailVerifiedAt: new Date(),
        },
    });

    const head = await prisma.user.create({
        data: {
            name: "Head",
            email: "head@test.test",
            password,
            emailVerifiedAt: new Date(),
        },
    });

    const hrd = await prisma.user.create({
        data: {
            name: "HRD",
            email: "hrd@test.test",
            password,
            emailVerifiedAt: new Date(),
        },
    });

    const employee = await prisma.user.create({
        data: {
            name: "Employee",
            email: "employee@test.test",
            password,
            emailVerifiedAt: new Date(),
        },
    });

    await prisma.role.createMany({
        data: [
            {
                name: "Admin",
            },
            {
                name: "Head",
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
                    userId: role.id === 1 ? admin.id : role.id === 2 ? head.id : role.id === 3 ? hrd.id : employee.id,
                    roleId: role.id,
                },
            ],
        });
    });

    for(let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                name: `Employee ${i}`,
                email: `employee${i}@test.test`,
                password,
                emailVerifiedAt: new Date()
            },
        });

        await prisma.userHasRole.create({
            data: {
                userId: user.id,
                roleId: 4
            }
        });
    }
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
