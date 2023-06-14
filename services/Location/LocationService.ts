import { Location } from "@prisma/client";
import LocationRepository from "../../repositories/Location/LocationRepository";
import ILocationService from "./ILocationService";
import OrganizationRepository from "../../repositories/Organization/OrganizationRepository";


class LocationService implements ILocationService {
    private locationRepository: LocationRepository;
    private organizationRepository: OrganizationRepository;

    constructor() {
        this.locationRepository = new LocationRepository();
        this.organizationRepository = new OrganizationRepository();
    }

    public getLocations = async (): Promise<Location[]> => {
        return await this.locationRepository.getLocations();
    };

    public createLocationByOrganization = async (organizationId: number, location: Location): Promise<Location> => {
        const organization = await this.organizationRepository.getOrganizationById(organizationId);
        if (!organization) {
            throw new Error("Organization not found");
        }
        location.latitude = parseFloat(location.latitude.toString());
        location.longitude = parseFloat(location.longitude.toString());
        location.interval = parseInt(location.interval.toString());
        location.range = parseInt(location.range.toString());
        return await this.locationRepository.createLocationByOrganization(organizationId, location);
    };
}

export default LocationService;