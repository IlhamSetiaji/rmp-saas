import { Shift } from "@prisma/client";

interface IShiftService {
    getShifts(): Promise<Shift[]>;
    createShiftByOrganization(organizationId: number, shift: Shift): Promise<Shift>;
}

export default IShiftService;