import { Presence } from "@prisma/client";

interface IPresenceRepository {
    getPresence(): Promise<Presence[]>;
    createPresenceByShift(shiftId: number, presence: Presence): Promise<Presence>;
    assignEmployeeToPresence(presenceId: number, userIds: number[]): Promise<any>;
}

export default IPresenceRepository;