import { Shift } from "@prisma/client";

interface IShiftService {
    getShifts(): Promise<Shift[]>;
}

export default IShiftService;