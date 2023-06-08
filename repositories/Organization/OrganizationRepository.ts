import { PrismaClient, Organization } from "@prisma/client";
import IOrganizationRepository from "./IOrganizationRepository";

class OrganizationRepository implements IOrganizationRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
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
            data: organization,
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
                                }
                            }
                        },
                    },
                },
            });
        });
        return true;
    };
}

export default OrganizationRepository;
