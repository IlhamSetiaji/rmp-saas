import { PrismaClient, Shift } from "@prisma/client";
import IShiftRepository from "./IShiftRepository";
import dayjs from "dayjs";
import { hour } from "../../config/timezone";

class ShiftRepository implements IShiftRepository {
    private prisma: PrismaClient;
    private now: Date;
    private timestamps: any;
    constructor() {
        this.prisma = new PrismaClient();
        this.now = dayjs().add(hour, 'hour').toDate();
        this.timestamps = {
            createdAt: this.now,
            updatedAt: this.now,
        };
    }

    getShifts = async () => {
        return this.prisma.shift.findMany();
    };

    createShiftByOrganization = async (organizationId: number, shift: Shift) => {
        shift.startAt = dayjs(shift.startAt).add(hour, 'hour').toDate();
        shift.endAt = dayjs(shift.endAt).add(hour, 'hour').toDate();
        return await this.prisma.shift.create({
            data: {
                ...shift,
                organization: {
                    connect: {
                        id: organizationId,
                    },
                },
                ...this.timestamps
            },
        });
    };
}

export default ShiftRepository;