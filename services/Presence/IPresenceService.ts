import { Presence } from "@prisma/client";

interface IPresenceService {
    getPresence(): Promise<Presence[]>;
    createPresenceByShift(shiftId: number, presence: Presence): Promise<Presence>;
    getPresencesByShiftId(shiftId: number): Promise<any>;
    updatePresenceById(presenceId: number, presence: Presence): Promise<any>;
    deletePresenceById(presenceId: number): Promise<any>;
    getCurrentEmployeePosition(): Promise<any>;
    getDistanceBetweenTwoPointsInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number;
    employeeAttendance(userId: number, presenceId: number): Promise<any>;
}

export default IPresenceService;