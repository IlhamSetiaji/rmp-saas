import { Presence } from "@prisma/client";

interface IPresenceService {
    getPresence(): Promise<Presence[]>;
    createPresenceByShift(shiftId: number, presence: Presence): Promise<Presence>;
}

export default IPresenceService;