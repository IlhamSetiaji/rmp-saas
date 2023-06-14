import LocationService from "../services/Location/LocationService";
import ResponseFormatter from "../helpers/ResponseFormatter";
import { Response, Request } from "express";

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
            const location = req.body;
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
}

export default new LocationController();
