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
        const organization = await this.organizationRepository.getOrganizationById(id);
        if (!organization) {
            throw new Error("Organization not found");
        }
        return await this.organizationRepository.getOrganizationById(id);
    };

    createOrganization = async (organization: Organization) => {
        return await this.organizationRepository.createOrganization(organization);
    };

    assignUsersToOrganization = async (userId: number[], organizationId: number) => {
        const organization = await this.organizationRepository.getOrganizationById(organizationId);
        if (!organization) {
            throw new Error("Organization not found");
        }
        return await this.organizationRepository.assignUsersToOrganization(userId, organizationId);
    };

    updateOrganization = async (id: number, organization: Organization) => {
        const organizationToUpdate = await this.organizationRepository.getOrganizationById(id);
        if (!organizationToUpdate) {
            throw new Error("Organization not found");
        }
        return await this.organizationRepository.updateOrganization(id, organization);
    };

    resignUsersFromOrganization = async (userId: number[], organizationId: number) => {
        const organization = await this.organizationRepository.getOrganizationById(organizationId);
        if (!organization) {
            throw new Error("Organization not found");
        }
        return await this.organizationRepository.resignUsersFromOrganization(userId, organizationId);
    };

    deleteOrganization = async (id: number) => {
        const organization = await this.organizationRepository.getOrganizationById(id);
        if (!organization) {
            throw new Error("Organization not found");
        }
        return await this.organizationRepository.deleteOrganization(id);
    };
}

export default OrganizationService;