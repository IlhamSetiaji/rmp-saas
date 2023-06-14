import ILocationRepository from "./ILocationRepository";
import { Location, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { hour } from "../../config/timezone";

class LocationRepository implements ILocationRepository {
    private prisma: PrismaClient;
    private now: Date;
    private timestamps: any;

    constructor() {
        this.prisma = new PrismaClient();
        this.now = dayjs().add(hour, "hour").toDate();
        this.timestamps = {
            createdAt: this.now,
            updatedAt: this.now,
        };
    }

    public getLocations = async (): Promise<Location[]> => {
        return await this.prisma.location.findMany();
    };

    public createLocationByOrganization = async (organizationId: number, location: Location): Promise<Location> => {
        return await this.prisma.location.create({
            data: {
                ...location,
                organizationId,
                ...this.timestamps,
            },
        });
    };

    public getLocationsByOrganization = async (organizationId: number): Promise<Location[]> => {
        return await this.prisma.location.findMany({
            where: {
                organizationId,
            },
        });
    };

    public getLocationById = async (locationId: number): Promise<Location> => {
        return await this.prisma.location.findUnique({
            where: {
                id: locationId,
            },
        }) as Location;
    };

    public updateLocationById = async (locationId: number, location: Location): Promise<Location> => {
        return await this.prisma.location.update({
            where: {
                id: locationId,
            },
            data: {
                ...location,
                updatedAt: this.now,
            },
        });
    };

    public deleteLocationById = async (locationId: number): Promise<Location> => {
        return await this.prisma.location.delete({
            where: {
                id: locationId,
            },
        });
    };
}

export default LocationRepository;
