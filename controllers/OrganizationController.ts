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
            return ResponseFormatter.success(
                res,
                organizations,
                "Organizations retrieved successfully"
            );
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
            return ResponseFormatter.success(
                res,
                organization,
                "Organization retrieved successfully"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    createOrganization = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.createOrganization(req.body);
            return ResponseFormatter.success(
                res,
                organization,
                "Organization created successfully"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    updateOrganization = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.updateOrganization(
                    parseInt(req.params.id),
                    req.body
                );
            return ResponseFormatter.success(
                res,
                organization,
                "Organization updated successfully"
            );
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
            return ResponseFormatter.success(
                res,
                organization,
                "Users assigned successfully"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    resignUsersFromOrganization = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.resignUsersFromOrganization(
                    req.body.userId,
                    parseInt(req.params.id)
                );
            return ResponseFormatter.success(
                res,
                organization,
                "Users resigned successfully"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    deleteOrganization = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.deleteOrganization(
                    parseInt(req.params.id)
                );
            return ResponseFormatter.success(
                res,
                organization,
                "Organization deleted successfully"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };
}

export default new OrganizationController();
