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
}

export default LocationRepository;
