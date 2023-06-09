import { Shift } from "@prisma/client";
import ShiftRepository from "../../repositories/Shift/ShiftRepository";
import IShiftService from "./IShiftService";
import dayjs from "dayjs";

class ShiftService implements IShiftService {
    private shiftRepository: ShiftRepository;
    constructor() {
        this.shiftRepository = new ShiftRepository();
    }

    getShifts = async () => {
        return this.shiftRepository.getShifts();
    };

    createShiftByOrganization = async (organizationId: number, shift: Shift) => {
        const today = dayjs(new Date()).format('YYYY-MM-DD');
        shift.startAt = new Date(today + " " + shift.startAt);
        shift.endAt = new Date(today + " " + shift.endAt);
        return await this.shiftRepository.createShiftByOrganization(organizationId, shift);
    };
}

export default ShiftService;