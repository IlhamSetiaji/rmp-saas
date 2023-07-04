import LocationService from "../services/Location/LocationService";
import ResponseFormatter from "../helpers/ResponseFormatter";
import { Response, Request } from "express";
import { CreateLocationRequest } from "../requests/Location/CreateLocationRequest";

class LocationController {
    private locationService: LocationService;

    constructor() {
        this.locationService = new LocationService();
    }

    public getLocations = async (req: Request, res: Response): Promise<any> => {
        try {
            const locations = await this.locationService.getLocations();
            return ResponseFormatter.success(
                res,
                locations,
                "Success get locations"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public createLocationByOrganization = async (req: Request, res: Response): Promise<any> => {
        try {
            const { organizationId } = req.params;
            const location: CreateLocationRequest = req.body;
            const createdLocation = await this.locationService.createLocationByOrganization(
                parseInt(organizationId),
                location
            );
            return ResponseFormatter.success(
                res,
                createdLocation,
                "Success create location"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public getLocationsByOrganization = async (req: Request, res: Response): Promise<any> => {
        try {
            const { organizationId } = req.params;
            const locations = await this.locationService.getLocationsByOrganization(
                parseInt(organizationId)
            );
            return ResponseFormatter.success(
                res,
                locations,
                "Success get locations by organization"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public getLocationById = async (req: Request, res: Response): Promise<any> => {
        try {
            const { locationId } = req.params;
            const location = await this.locationService.getLocationById(
                parseInt(locationId)
            );
            return ResponseFormatter.success(
                res,
                location,
                "Success get location by id"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public updateLocationById = async (req: Request, res: Response): Promise<any> => {
        try {
            const { locationId } = req.params;
            const location: CreateLocationRequest = req.body;
            const updatedLocation = await this.locationService.updateLocationById(
                parseInt(locationId),
                location
            );
            return ResponseFormatter.success(
                res,
                updatedLocation,
                "Success update location by id"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public deleteLocationById = async (req: Request, res: Response): Promise<any> => {
        try {
            const { locationId } = req.params;
            const deletedLocation = await this.locationService.deleteLocationById(
                parseInt(locationId)
            );
            return ResponseFormatter.success(
                res,
                deletedLocation,
                "Success delete location by id"
            );
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };
}

export default new LocationController();
