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
}

export default PresenceRepository;
