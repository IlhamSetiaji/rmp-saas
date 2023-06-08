import { Request, Response } from "express";
import OrganizationService from "../services/Organization/OrganizationService";
import ResponseFormatter from "../helpers/ResponseFormatter";

class OrganizationController {
    private organizationService: OrganizationService;
    constructor() {
        this.organizationService = new OrganizationService();
    }

    getAllOrganizations = async (req: Request, res: Response) => {
        try {
            const organizations =
                await this.organizationService.getAllOrganizations();
            return ResponseFormatter.success(res, organizations);
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    getOrganizationById = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.getOrganizationById(
                    parseInt(req.params.id)
                );
            return ResponseFormatter.success(res, organization);
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    createOrganization = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.createOrganization(req.body);
            return ResponseFormatter.success(res, organization);
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    assignUsersToOrganization = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.assignUsersToOrganization(
                    req.body.userId,
                    parseInt(req.params.id)
                );
            return ResponseFormatter.success(res, organization);
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };
}

export default new OrganizationController();
