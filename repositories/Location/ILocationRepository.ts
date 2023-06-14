import { Location } from "@prisma/client";

interface ILocationRepository {
    getLocations(): Promise<Location[]>;
    createLocationByOrganization(organizationId: number, location: Location): Promise<Location>;
}

export default ILocationRepository;