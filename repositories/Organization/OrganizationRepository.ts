import { PrismaClient, Organization } from "@prisma/client";
import IOrganizationRepository from "./IOrganizationRepository";
import dayjs from "dayjs";
import { hour } from "../../config/timezone";

class OrganizationRepository implements IOrganizationRepository {
    private prisma: PrismaClient;
    private now: Date;
    private timestamps: any;
    constructor() {
        this.prisma = new PrismaClient();
        this.now = dayjs().add(hour, 'hour').toDate();
        this.timestamps = {
            createdAt: this.now,
            updatedAt: this.now,
        };
    }

    getAllOrganizations = async (): Promise<Organization[]> => {
        return await this.prisma.organization.findMany();
    };

    getOrganizationById = async (id: number): Promise<Organization> => {
        return (await this.prisma.organization.findUnique({
            where: { id },
        })) as Organization;
    };

    createOrganization = async (
        organization: Organization
    ): Promise<Organization> => {
        return await this.prisma.organization.create({
            data: {
                ...organization,
                ...this.timestamps
            },
        });
    };

    assignUsersToOrganization = async (
        userId: number[],
        organizationId: number
    ): Promise<any> => {
        userId.forEach(async (id) => {
            await this.prisma.organization.update({
                where: { id: organizationId },
                data: {
                    users: {
                        create: {
                            user: {
                                connect: {
                                    id: +id,
                                },
                            },
                            ...this.timestamps
                        },
                    },
                },
            });
        });
        return true;
    };

    updateOrganization = async (
        id: number,
        organization: Organization
    ): Promise<Organization> => {
        return await this.prisma.organization.update({
            where: { id },
            data: {
                ...organization,
                updatedAt: this.now,
            },
        });
    };

    resignUsersFromOrganization = async (
        userId: number[],
        organizationId: number
    ): Promise<any> => {
        await this.prisma.organization.update({
            where: { id: organizationId },
            data: {
                users: {
                    deleteMany: userId.map((id) => {
                        return {
                            userId: +id,
                        };
                    }),
                },
            },
        });
        return true;
    };

    deleteOrganization = async (id: number): Promise<Organization> => {
        return await this.prisma.organization.delete({
            where: { id },
        });
    };

    assignMyselfToOrganization = async (
        userId: number,
        organizationId: number
    ): Promise<any> => {
        await this.prisma.organization.update({
            where: { id: organizationId },
            data: {
                users: {
                    create: {
                        user: {
                            connect: {
                                id: +userId,
                            },
                        },
                        ...this.timestamps
                    },
                },
            },
        });
        return true;
    };

    checkIfUserExistInOrganization = async (
        userId: number,
        organizationId: number
    ): Promise<boolean> => {
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
            include: {
                users: true,
            },
        });
        const user = organization?.users.find((user) => user.userId === userId);
        if (user) {
            return true;
        }
        return false;
    };
}

export default OrganizationRepository;
