import { Request, Response } from "express";
import OrganizationService from "../services/Organization/OrganizationService";
import ResponseFormatter from "../helpers/ResponseFormatter";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs-extra";
import { CreateOrganizationValidation, CreateOrganizationValidationHandler } from "../validations/Organization/OrganizationValidator";

class OrganizationController {
    private organizationService: OrganizationService;
    private upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                const path = `./uploads/organization`;
                fs.mkdirsSync(path);
                callback(null, path);
            },
            filename: (req, file, cb) => {
                const extension = path.extname(file.originalname);
                const uniqueSuffix = `${Date.now()}-${Math.round(
                    Math.random() * 1e9
                )}`;
                cb(null, `file-${uniqueSuffix}${extension}`);
            },
        }),
        fileFilter: (req, file, cb: FileFilterCallback) => {
            const allowedExtensions = [".jpg", ".jpeg", ".png"]; // Add more allowed extensions if necessary
            const extension = path.extname(file.originalname);
            if (allowedExtensions.includes(extension)) {
                cb(null, true);
            } else {
                cb(new Error("Invalid file extension"));
            }
        },
    });

    constructor() {
        this.organizationService = new OrganizationService();
    }

    createOrganization = async (req: Request, res: Response) => {
        if(!req.file){
            throw new Error("No file uploaded");
        }
        try {
            const payload = req.body;
            payload.image = req.file.path;
            const organization =
                await this.organizationService.createOrganization(
                    payload
                );
            return ResponseFormatter.success(
                res,
                organization,
                "Organization created successfully"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    createOrganizationHandler = (): any => {
        return [
            this.upload.single("image"),
            CreateOrganizationValidation,
            CreateOrganizationValidationHandler,
            this.createOrganization
        ];
    };                    

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

    assignMyselfToOrganization = async (req: Request, res: Response) => {
        try {
            const organization =
                await this.organizationService.assignMyselfToOrganization(
                    req.currentUser.id,
                    parseInt(req.params.id)
                );
            return ResponseFormatter.success(
                res,
                organization,
                "Organization assigned successfully"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };
}

export default new OrganizationController();
