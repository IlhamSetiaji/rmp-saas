import { Organization } from "@prisma/client";
import OrganizationRepository from "../../repositories/Organization/OrganizationRepository";
import IOrganizationService from "./IOrganizationService";


class OrganizationService implements IOrganizationService{
    private organizationRepository: OrganizationRepository;
    constructor() {
        this.organizationRepository = new OrganizationRepository();
    }

    getAllOrganizations = async () => {
        return await this.organizationRepository.getAllOrganizations();
    };

    getOrganizationById = async (id: number) => {
        return await this.organizationRepository.getOrganizationById(id);
    };

    createOrganization = async (organization: Organization) => {
        return await this.organizationRepository.createOrganization(organization);
    };

    assignUsersToOrganization = async (userId: number[], organizationId: number) => {
        return await this.organizationRepository.assignUsersToOrganization(userId, organizationId);
    };
}

export default OrganizationService;