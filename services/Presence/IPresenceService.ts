import { Presence } from "@prisma/client";

interface IPresenceService {
    getPresence(): Promise<Presence[]>;
    createPresenceByShift(shiftId: number, presence: Presence): Promise<Presence>;
    getPresencesByShiftId(shiftId: number): Promise<any>;
    updatePresenceById(presenceId: number, presence: Presence): Promise<any>;
    deletePresenceById(presenceId: number): Promise<any>;
}

export default IPresenceService;