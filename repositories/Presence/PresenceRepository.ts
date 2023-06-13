import { Presence, PrismaClient } from "@prisma/client";
import IPresenceRepository from "./IPresenceRepository";
import dayjs from "dayjs";
import { hour } from "../../config/timezone";

class PresenceRepository implements IPresenceRepository {
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

    public getPresence = async (): Promise<any> => {
        const presences = await this.prisma.presence.findMany({
            include: {
                users: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return presences.map((presence) => {
            return {
                ...presence,
                users: presence.users.map((user) => {
                    return {
                        ...user,
                        user: {
                            ...user.user,
                            password: undefined,
                        },
                    };
                }),
            };
        });
    };

    public findPresenceById = async (presenceId: number): Promise<any> => {
        const presence = await this.prisma.presence.findUnique({
            where: {
                id: presenceId,
            },
            include: {
                users: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!presence) {
            throw new Error("Presence not found.");
        }
        return {
            ...presence,
            users: presence.users.map((user) => {
                return {
                    ...user,
                    user: {
                        ...user.user,
                        password: undefined,
                    },
                };
            }),
        };
    };

    public createPresenceByShift = async (
        shiftId: number,
        presence: Presence
    ): Promise<Presence> => {
        const now = dayjs().add(hour, "hour").toDate();
        if (presence.endAt < now) {
            throw new Error("End time must be greater than current time");
        }
        presence.latitude = +presence.latitude;
        presence.longitude = +presence.longitude;
        presence.accuracy = +presence.accuracy;
        return await this.prisma.presence.create({
            data: {
                ...presence,
                shiftId,
                ...this.timestamps,
            },
        });
    };

    public assignEmployeeToPresence = async (
        presenceId: number,
        userIds: number[]
    ): Promise<any> => {
        userIds.forEach(async (userId) => {
            await this.prisma.presence.update({
                where: {
                    id: presenceId,
                },
                data: {
                    users: {
                        create: {
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                            range: 0,
                            ...this.timestamps,
                        },
                    },
                },
            });
        });
        return true;
    };

    public getPresencesByShiftId = async (shiftId: number): Promise<any> => {
        const presences = await this.prisma.presence.findMany({
            where: {
                shiftId,
            },
            include: {
                users: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return presences.map((presence) => {
            return {
                ...presence,
                users: presence.users.map((user) => {
                    return {
                        ...user,
                        user: {
                            ...user.user,
                            password: undefined,
                        },
                    };
                }),
            };
        });
    };

    public updatePresenceById = async (
        presenceId: number,
        presence: Presence
    ): Promise<any> => {
        const now = dayjs().add(hour, "hour").toDate();
        if (presence.endAt < now) {
            throw new Error("End time must be greater than current time");
        }
        presence.latitude = +presence.latitude;
        presence.longitude = +presence.longitude;
        presence.accuracy = +presence.accuracy;
        return await this.prisma.presence.update({
            where: {
                id: presenceId,
            },
            data: {
                ...presence,
                ...this.timestamps,
            },
        });
    };

    public deletePresenceById = async (presenceId: number): Promise<any> => {
        return await this.prisma.presence.delete({
            where: {
                id: presenceId,
            },
        });
    };

    public employeeAttendance = async (
        userId: number,
        presenceId: number,
        range: number
    ): Promise<any> => {
        const presence = await this.prisma.presence.findUnique({
            where: {
                id: presenceId,
            },
            include: {
                users: {
                    where: {
                        userId,
                    },
                },
            },
        });
        if (!presence) {
            throw new Error("Presence not found.");
        }
        if (presence.users.length === 0) {
            throw new Error("User not found.");
        }
        const user = presence.users[0];
        const now = dayjs().add(hour, "hour").toDate();
        const diff = dayjs(now).diff(dayjs(presence.endAt), "minute");
        if (diff > 0) {
            throw new Error("Presence has ended.");
        }
        const diffStart = dayjs(now).diff(dayjs(presence.startAt), "minute");
        if (diffStart < 0) {
            throw new Error("Presence has not started yet.");
        }
        let status = "";
        if(diffStart > 0 && diffStart < presence.accuracy) {
            status = 'ONTIME';
        } else {
            status = 'LATE';
        }
        const updatedUser = await this.prisma.presenceHasUser.update({
            where: {
                id: user.id,
            },
            data: {
                range: +range,
                status,
                ...this.timestamps,
            },
        });
        return updatedUser;
    };
}

export default PresenceRepository;
