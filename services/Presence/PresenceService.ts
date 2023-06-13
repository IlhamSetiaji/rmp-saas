import { Presence } from "@prisma/client";
import IPresenceService from "./IPresenceService";
import PresenceRepository from "../../repositories/Presence/PresenceRepository";
import ShiftRepository from "../../repositories/Shift/ShiftRepository";
import dayjs from "dayjs";


class PresenceService implements IPresenceService {
    private presenceRepository: PresenceRepository;
    private shiftRepository: ShiftRepository;
    constructor() {
        this.presenceRepository = new PresenceRepository();
        this.shiftRepository = new ShiftRepository();
    }

    public getPresence = async (): Promise<Presence[]> => {
        return await this.presenceRepository.getPresence();
    };

    public createPresenceByShift = async (shiftId: number, presence: Presence): Promise<any> => {
        const shift = await this.shiftRepository.getShiftById(shiftId);
        if (!shift) {
            throw new Error("Shift not found.");
        }
        const users = await this.shiftRepository.getUsersByShiftId(shiftId);
        if(users.users.length === 0) {
            throw new Error("Shift has no user. Please add user first.");
        }
        const today = dayjs(new Date()).format("YYYY-MM-DD");
        presence.name = 'Presensi Tanggal ' + today;
        presence.startAt = new Date(today + " " + dayjs(shift.startAt).format("HH:mm:ss"));
        presence.endAt = new Date(today + " " + dayjs(shift.endAt).format("HH:mm:ss"));
        const diff = dayjs(presence.endAt).diff(dayjs(presence.startAt), "minute");
        if (diff < 0) {
            throw new Error("End time must be greater than start time");
        }
        const createdPresence = await this.presenceRepository.createPresenceByShift(shiftId, presence);
        await this.presenceRepository.assignEmployeeToPresence(createdPresence.id, users.users.map((user: any) => user.id));
        return createdPresence;
    };
}

export default PresenceService;