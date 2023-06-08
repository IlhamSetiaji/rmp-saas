import { Organization } from "@prisma/client";

interface IOrganizationRepository {
    getAllOrganizations(): Promise<Organization[]>;
    getOrganizationById(id: number): Promise<Organization>;
    createOrganization(organization: Organization): Promise<Organization>;
    assignUsersToOrganization(userId: number[], organizationId: number): Promise<any>;
    updateOrganization(id: number, organization: Organization): Promise<Organization>;
    resignUsersFromOrganization(userId: number[], organizationId: number): Promise<any>;
    deleteOrganization(id: number): Promise<Organization>;
}

export default IOrganizationRepository;
