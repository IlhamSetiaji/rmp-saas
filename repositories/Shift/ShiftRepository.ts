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
        this.now = dayjs().add(hour, "hour").toDate();
        this.timestamps = {
            createdAt: this.now,
            updatedAt: this.now,
        };
    }

    getShifts = async () => {
        return this.prisma.shift.findMany();
    };

    createShiftByOrganization = async (
        organizationId: number,
        shift: Shift
    ) => {
        shift.startAt = dayjs(shift.startAt).add(hour, "hour").toDate();
        shift.endAt = dayjs(shift.endAt).add(hour, "hour").toDate();
        return await this.prisma.shift.create({
            data: {
                ...shift,
                organization: {
                    connect: {
                        id: organizationId,
                    },
                },
                ...this.timestamps,
            },
        });
    };

    getShiftsByOrganization = async (organizationId: number) => {
        return await this.prisma.shift.findMany({
            where: {
                organizationId: organizationId,
            },
        });
    };

    getShiftById = async (shiftId: number) => {
        return await this.prisma.shift.findUnique({
            where: {
                id: shiftId,
            },
        });
    };

    updateShiftById = async (shiftId: number, shift: Shift) => {
        shift.startAt = dayjs(shift.startAt).add(hour, "hour").toDate();
        shift.endAt = dayjs(shift.endAt).add(hour, "hour").toDate();
        return await this.prisma.shift.update({
            where: {
                id: shiftId,
            },
            data: {
                ...shift,
                ...this.timestamps,
            },
        });
    };

    deleteShiftById = async (shiftId: number) => {
        return await this.prisma.shift.delete({
            where: {
                id: shiftId,
            },
        });
    };

    assignEmployeesToShift = async (shiftId: number, userIds: number[]) => {
        const shift = await this.prisma.shift.findUnique({
            where: {
                id: shiftId,
            },
        });
        if (!shift) {
            throw new Error("Shift not found");
        }
        userIds.forEach(async (id) => {
            await this.prisma.shift.update({
                where: {
                    id: shiftId,
                },
                data: {
                    users: {
                        create: {
                            user: {
                                connect: {
                                    id: +id,
                                },
                            },
                            ...this.timestamps,
                        },
                    },
                },
            });
        });
        return shift;
    };

    getUsersByShiftId = async (shiftId: number) => {
        const shift = await this.prisma.shift.findUnique({
            where: {
                id: shiftId,
            },
            include: {
                users: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return shift
            ? { ...shift, users: shift.users.map((user) => user.user) }
            : { shift: null, users: [] };
    };

    resignEmployeesFromShift = async (shiftId: number, userIds: number[]) => {
        const shift = await this.prisma.shift.findUnique({
            where: {
                id: shiftId,
            },
        });
        if (!shift) {
            throw new Error("Shift not found");
        }
        await this.prisma.shift.update({
            where: {
                id: shiftId,
            },
            data: {
                users: {
                    deleteMany: userIds.map((id) => ({
                        userId: +id,
                    })),
                },
            },
        });
        return shift;
    };

    checkIfUserExistInShift = async (shiftId: number, userId: number) => {
        const shift = await this.prisma.shift.findUnique({
            where: {
                id: shiftId,
            },
            include: {
                users: {
                    where: {
                        userId: userId,
                    },
                },
            },
        });
        return shift ? shift.users.length > 0 : false;
    };
}

export default ShiftRepository;
