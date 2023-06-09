import { Shift } from "@prisma/client";

interface IShiftRepository {
    getShifts(): Promise<Shift[]>;
}

export default IShiftRepository;