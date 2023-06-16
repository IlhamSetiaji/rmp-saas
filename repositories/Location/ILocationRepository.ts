import { Location } from "@prisma/client";
import { CreateLocationRequest } from "../../requests/Location/CreateLocationRequest";

interface ILocationRepository {
    getLocations(): Promise<Location[]>;
    createLocationByOrganization(organizationId: number, location: CreateLocationRequest): Promise<Location>;
    getLocationsByOrganization(organizationId: number): Promise<Location[]>;
    getLocationById(locationId: number): Promise<Location> | null;
    updateLocationById(locationId: number, location: CreateLocationRequest): Promise<Location>;
    deleteLocationById(locationId: number): Promise<Location>;
    checkIfLocationExistInOrganization(locationId: number, organizationId: number): Promise<boolean>;
    insertReportLocation(organizationId: number, employeeId: number, locationId: number): Promise<any>;
}

export default ILocationRepository;