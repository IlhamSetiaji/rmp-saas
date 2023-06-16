import { Location } from '@prisma/client';
import LocationRepository from "../../repositories/Location/LocationRepository";
import ILocationService from "./ILocationService";
import OrganizationRepository from "../../repositories/Organization/OrganizationRepository";
import axios from 'axios';
import { CreateLocationRequest } from '../../requests/Location/CreateLocationRequest';


class LocationService implements ILocationService {
    private locationRepository: LocationRepository;
    private organizationRepository: OrganizationRepository;

    constructor() {
        this.locationRepository = new LocationRepository();
        this.organizationRepository = new OrganizationRepository();
    }

    private changeLocationTypeFormat = (location: CreateLocationRequest): CreateLocationRequest => {
        location.latitude = parseFloat(location.latitude.toString());
        location.longitude = parseFloat(location.longitude.toString());
        location.interval = parseInt(location.interval.toString());
        location.range = parseInt(location.range.toString());
        return location as CreateLocationRequest;
    };

    public getLocations = async (): Promise<Location[]> => {
        return await this.locationRepository.getLocations();
    };

    public createLocationByOrganization = async (organizationId: number, location: CreateLocationRequest): Promise<Location> => {
        const organization = await this.organizationRepository.getOrganizationById(organizationId);
        if (!organization) {
            throw new Error("Organization not found");
        }
        location = this.changeLocationTypeFormat(location);
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

    public updateLocationById = async (locationId: number, location: CreateLocationRequest): Promise<Location> => {
        const locationData = await this.locationRepository.getLocationById(locationId);
        if (!locationData) {
            throw new Error("Location not found");
        }
        location = this.changeLocationTypeFormat(location);
        return await this.locationRepository.updateLocationById(locationId, location);
    };

    public deleteLocationById = async (locationId: number): Promise<Location> => {
        const location = await this.locationRepository.getLocationById(locationId);
        if (!location) {
            throw new Error("Location not found");
        }
        return await this.locationRepository.deleteLocationById(locationId);
    };

    private getDistanceBetweenTwoPointsInMeters = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(R * c);
    };

    private getCurrentEmployeePosition = async (): Promise<any> => {
        const URL =
            "https://ipgeolocation.abstractapi.com/v1/?api_key=" +
            process.env.ABSTRACT_API_KEY;
        // const ipAddress = IP.address(); // uncomment when deploy
        const ipAddress = "36.68.221.241"; // comment when deploy
        const apiResponse = await axios.get(URL + "&ip_address=" + ipAddress);
        return apiResponse.data;
    };


    public employeeCheckLocation = async (organizationId: number, employeeId: number, locationId: number): Promise<any> => {
        const location = await this.locationRepository.getLocationById(locationId);
        if (!location) {
            throw new Error("Location not found");
        }
        const checkedLocation = await this.locationRepository.checkIfLocationExistInOrganization(locationId, organizationId);
        if (!checkedLocation) {
            throw new Error("Location not found in organization");
        }
        const currentEmployeePosition = await this.getCurrentEmployeePosition();
        const distance = this.getDistanceBetweenTwoPointsInMeters(
            currentEmployeePosition.latitude,
            currentEmployeePosition.longitude,
            location.latitude,
            location.longitude
        );
        return {
            distance,
            isInRange: distance <= location.range,
        };
    };
}

export default LocationService;