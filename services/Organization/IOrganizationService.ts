import { Organization } from "@prisma/client";

interface IOrganizationService {
    getAllOrganizations(): Promise<Organization[]>;
    getOrganizationById(id: number): Promise<Organization>;
    createOrganization(organization: Organization): Promise<Organization>;
    assignUsersToOrganization(userId: number[], organizationId: number): Promise<Organization>;
    updateOrganization(id: number, organization: Organization): Promise<Organization>;
    resignUsersFromOrganization(userId: number[], organizationId: number): Promise<Organization>;
    deleteOrganization(id: number): Promise<Organization>;
    assignMyselfToOrganization(userId: number, organizationId: number): Promise<Organization>;
}

export default IOrganizationService;