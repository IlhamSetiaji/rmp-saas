import { Location } from "@prisma/client";

interface ILocationRepository {
    getLocations(): Promise<Location[]>;
    createLocationByOrganization(organizationId: number, location: Location): Promise<Location>;
    getLocationsByOrganization(organizationId: number): Promise<Location[]>;
    getLocationById(locationId: number): Promise<Location> | null;
    updateLocationById(locationId: number, location: Location): Promise<Location>;
    deleteLocationById(locationId: number): Promise<Location>;
}

export default ILocationRepository;