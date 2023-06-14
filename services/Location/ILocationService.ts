import { Location } from "@prisma/client";

interface ILocationService {
    getLocations(): Promise<Location[]>;
    createLocationByOrganization(organizationId: number, location: Location): Promise<Location>;
}

export default ILocationService;