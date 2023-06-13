import { Presence } from "@prisma/client";

interface IPresenceRepository {
    getPresence(): Promise<Presence[]>;
    findPresenceById(presenceId: number): Promise<Presence>;
    createPresenceByShift(shiftId: number, presence: Presence): Promise<Presence>;
    assignEmployeeToPresence(presenceId: number, userIds: number[]): Promise<any>;
    getPresencesByShiftId(shiftId: number): Promise<any>;
    updatePresenceById(presenceId: number, presence: Presence): Promise<any>;
    deletePresenceById(presenceId: number): Promise<any>;
}

export default IPresenceRepository;