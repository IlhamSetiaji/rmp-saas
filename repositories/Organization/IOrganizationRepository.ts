import { Organization } from "@prisma/client";

interface IOrganizationRepository {
    getAllOrganizations(): Promise<Organization[]>;
    getOrganizationById(id: number): Promise<Organization>;
    createOrganization(organization: Organization): Promise<Organization>;
    assignUsersToOrganization(userId: number[], organizationId: number): Promise<any>;
}

export default IOrganizationRepository;
