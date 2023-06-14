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

    public getLocationsByOrganization = async (organizationId: number): Promise<Location[]> => {
        const organization = await this.organizationRepository.getOrganizationById(organizationId);
        if (!organization) {
            throw new Error("Organization not found");
        }
        return await this.locationRepository.getLocationsByOrganization(organizationId);
    };

    public getLocationById = async (locationId: number): Promise<Location> => {
        const location = await this.locationRepository.getLocationById(locationId);
        if (!location) {
            throw new Error("Location not found");
        }
        return location;
    };

    public updateLocationById = async (locationId: number, location: Location): Promise<Location> => {
        const locationData = await this.locationRepository.getLocationById(locationId);
        if (!locationData) {
            throw new Error("Location not found");
        }
        location.latitude = parseFloat(location.latitude.toString());
        location.longitude = parseFloat(location.longitude.toString());
        location.interval = parseInt(location.interval.toString());
        location.range = parseInt(location.range.toString());
        return await this.locationRepository.updateLocationById(locationId, location);
    };

    public deleteLocationById = async (locationId: number): Promise<Location> => {
        const location = await this.locationRepository.getLocationById(locationId);
        if (!location) {
            throw new Error("Location not found");
        }
        return await this.locationRepository.deleteLocationById(locationId);
    };
}

export default LocationService;