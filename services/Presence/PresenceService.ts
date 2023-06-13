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

    public getDistanceBetweenTwoPointsInMeters = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) *
                Math.cos(φ2) *
                Math.sin(Δλ / 2) *
                Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(R * c);
    };

    public employeeAttendance = async (
        userId: number,
        presenceId: number,
    ): Promise<any> => {
        const presence = await this.presenceRepository.findPresenceById(
            presenceId
        );
        if (!presence) {
            throw new Error("Presence not found.");
        }
        const user = presence.users.find((user: any) => user.userId === userId);
        if (!user) {
            throw new Error("User not found.");
        }
        const currentEmployeePosition = await this.getCurrentEmployeePosition();
        const distance = this.getDistanceBetweenTwoPointsInMeters(
            currentEmployeePosition.latitude,
            currentEmployeePosition.longitude,
            presence.latitude,
            presence.longitude
        );
        if (distance > presence.range) {
            throw new Error("You are not in the range.");
        }
        return await this.presenceRepository.employeeAttendance(
            userId,
            presenceId,
            distance
        );
    };
}

export default PresenceService;
