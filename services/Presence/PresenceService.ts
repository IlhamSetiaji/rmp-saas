import { Presence } from "@prisma/client";
import IPresenceService from "./IPresenceService";
import PresenceRepository from "../../repositories/Presence/PresenceRepository";
import ShiftRepository from "../../repositories/Shift/ShiftRepository";
import dayjs from "dayjs";
import axios from "axios";
// import IP from "ip"; // uncomment when deploy

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

    public createPresenceByShift = async (
        shiftId: number,
        presence: Presence
    ): Promise<any> => {
        const shift = await this.shiftRepository.getShiftById(shiftId);
        if (!shift) {
            throw new Error("Shift not found.");
        }
        const users = await this.shiftRepository.getUsersByShiftId(shiftId);
        if (users.users.length === 0) {
            throw new Error("Shift has no user. Please add user first.");
        }
        const today = dayjs(new Date()).format("YYYY-MM-DD");
        presence.name = "Presensi Tanggal " + today;
        presence.startAt = new Date(
            today + " " + dayjs(shift.startAt).format("HH:mm:ss")
        );
        presence.endAt = new Date(
            today + " " + dayjs(shift.endAt).format("HH:mm:ss")
        );
        const diff = dayjs(presence.endAt).diff(
            dayjs(presence.startAt),
            "minute"
        );
        if (diff < 0) {
            throw new Error("End time must be greater than start time");
        }
        const createdPresence =
            await this.presenceRepository.createPresenceByShift(
                shiftId,
                presence
            );
        await this.presenceRepository.assignEmployeeToPresence(
            createdPresence.id,
            users.users.map((user: any) => user.id)
        );
        return createdPresence;
    };

    public getPresencesByShiftId = async (shiftId: number): Promise<any> => {
        const shift = await this.shiftRepository.getShiftById(shiftId);
        if (!shift) {
            throw new Error("Shift not found.");
        }
        return await this.presenceRepository.getPresencesByShiftId(shiftId);
    };

    public updatePresenceById = async (
        presenceId: number,
        presence: Presence
    ): Promise<any> => {
        const presenceToUpdate = await this.presenceRepository.findPresenceById(
            presenceId
        );
        if (!presenceToUpdate) {
            throw new Error("Presence not found.");
        }
        const shift = await this.shiftRepository.getShiftById(
            presenceToUpdate.shiftId
        );
        if (!shift) {
            throw new Error("Shift not found.");
        }
        const today = dayjs(new Date()).format("YYYY-MM-DD");
        presence.startAt = new Date(
            today + " " + dayjs(shift.startAt).format("HH:mm:ss")
        );
        presence.endAt = new Date(
            today + " " + dayjs(shift.endAt).format("HH:mm:ss")
        );
        const diff = dayjs(presence.endAt).diff(
            dayjs(presence.startAt),
            "minute"
        );
        if (diff < 0) {
            throw new Error("End time must be greater than start time");
        }
        return await this.presenceRepository.updatePresenceById(
            presenceId,
            presence
        );
    };

    public deletePresenceById = async (presenceId: number): Promise<any> => {
        const presenceToDelete = await this.presenceRepository.findPresenceById(
            presenceId
        );
        if (!presenceToDelete) {
            throw new Error("Presence not found.");
        }
        return await this.presenceRepository.deletePresenceById(presenceId);
    };

    public getCurrentEmployeePosition = async (): Promise<any> => {
        const URL =
            "https://ipgeolocation.abstractapi.com/v1/?api_key=" +
            process.env.ABSTRACT_API_KEY;
        // const ipAddress = IP.address(); // uncomment when deploy
        const ipAddress = "36.68.221.241"; // comment when deploy
        const apiResponse = await axios.get(URL + "&ip_address=" + ipAddress);
        return apiResponse.data;
    };
}

export default PresenceService;
