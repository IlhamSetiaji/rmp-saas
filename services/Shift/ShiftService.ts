import { Organization, Shift } from "@prisma/client";
import ShiftRepository from "../../repositories/Shift/ShiftRepository";
import IShiftService from "./IShiftService";
import dayjs from "dayjs";
import OrganizationRepository from "../../repositories/Organization/OrganizationRepository";

class ShiftService implements IShiftService {
    private shiftRepository: ShiftRepository;
    private organizationRepository: OrganizationRepository;
    constructor() {
        this.shiftRepository = new ShiftRepository();
        this.organizationRepository = new OrganizationRepository();
    }

    getShifts = async () => {
        return this.shiftRepository.getShifts();
    };

    checkIfOrganizationExist = async (organizationId: number) => {
        const organization: Organization | null =
            await this.organizationRepository.getOrganizationById(
                organizationId
            );
        if (!organization) {
            throw new Error("Organization not found");
        }
        return true;
    };

    createShiftByOrganization = async (
        organizationId: number,
        shift: Shift
    ) => {
        const today = dayjs(new Date()).format("YYYY-MM-DD");
        shift.startAt = new Date(today + " " + shift.startAt);
        shift.endAt = new Date(today + " " + shift.endAt);
        const diff = dayjs(shift.endAt).diff(dayjs(shift.startAt), "minute");
        if (diff < 0) {
            throw new Error("End time must be greater than start time");
        }
        await this.checkIfOrganizationExist(organizationId);
        return await this.shiftRepository.createShiftByOrganization(
            organizationId,
            shift
        );
    };

    getShiftsByOrganization = async (organizationId: number) => {
        await this.checkIfOrganizationExist(organizationId);
        return await this.shiftRepository.getShiftsByOrganization(
            organizationId
        );
    };

    getShiftById = async (shiftId: number) => {
        return await this.shiftRepository.getShiftById(shiftId);
    };

    updateShiftById = async (shiftId: number, shift: Shift) => {
        const shiftToUpdate = await this.shiftRepository.getShiftById(shiftId);
        if (!shiftToUpdate) {
            throw new Error("Shift not found");
        }
        const today = dayjs(new Date()).format("YYYY-MM-DD");
        shift.startAt = new Date(today + " " + shift.startAt);
        shift.endAt = new Date(today + " " + shift.endAt);
        const diff = dayjs(shift.endAt).diff(dayjs(shift.startAt), "minute");
        if (diff < 0) {
            throw new Error("End time must be greater than start time");
        }
        return await this.shiftRepository.updateShiftById(shiftId, shift);
    };

    deleteShiftById = async (shiftId: number) => {
        const shiftToDelete = await this.shiftRepository.getShiftById(shiftId);
        if (!shiftToDelete) {
            throw new Error("Shift not found");
        }
        return await this.shiftRepository.deleteShiftById(shiftId);
    };

    assignEmployeesToShift = async (shiftId: number, userIds: number[]) => {
        const shift = await this.shiftRepository.getShiftById(shiftId);
        if (!shift) {
            throw new Error("Shift not found");
        }
        const users = await this.shiftRepository.getUsersByShiftId(shiftId);
        const usersId = users.users.map((user) => user.id);
        const usersToAssign = userIds.filter((id) => !usersId.includes(+id));
        return await this.shiftRepository.assignEmployeesToShift(
            shiftId,
            usersToAssign
        );
    };

    getUsersByShiftId = async (shiftId: number): Promise<any> => {
        const shift = await this.shiftRepository.getShiftById(shiftId);
        if (!shift) {
            throw new Error("Shift not found");
        }
        const users = await this.shiftRepository.getUsersByShiftId(shiftId);
        if(users.users.length === 0) {
            throw new Error("No users assigned to this shift");
        }
        return users;
    };

    resignEmployeesFromShift = async (shiftId: number, userIds: number[]): Promise<any> => {
        const shift = await this.shiftRepository.getShiftById(shiftId);
        if (!shift) {
            throw new Error("Shift not found");
        }
        const users = await this.shiftRepository.getUsersByShiftId(shiftId);
        const usersId = users.users.map((user) => user.id);
        const usersToResign = userIds.filter((id) => usersId.includes(+id));
        return await this.shiftRepository.resignEmployeesFromShift(
            shiftId,
            usersToResign
        );
    };
}

export default ShiftService;
