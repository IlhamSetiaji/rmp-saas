import { Location } from "@prisma/client";
import { CreateLocationRequest } from "../../requests/Location/CreateLocationRequest";

interface ILocationService {
    getLocations(): Promise<Location[]>;
    createLocationByOrganization(organizationId: number, location: CreateLocationRequest): Promise<Location>;
    getLocationsByOrganization(organizationId: number): Promise<Location[]>;
    getLocationById(locationId: number): Promise<Location>;
    updateLocationById(locationId: number, location: CreateLocationRequest): Promise<Location>;
    deleteLocationById(locationId: number): Promise<Location>;
    employeeCheckLocation(organizationId: number, employeeId: number, locationId: number): Promise<any>;
}

export default ILocationService;