import { Organization } from "@prisma/client";

interface IOrganizationService {
    getAllOrganizations(): Promise<Organization[]>;
    getOrganizationById(id: number): Promise<Organization>;
    createOrganization(organization: Organization): Promise<Organization>;
    assignUsersToOrganization(userId: number[], organizationId: number): Promise<Organization>;
}

export default IOrganizationService;