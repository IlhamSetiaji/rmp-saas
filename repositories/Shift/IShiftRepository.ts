import { Shift } from "@prisma/client";

interface IShiftRepository {
    getShifts(): Promise<Shift[]>;
    createShiftByOrganization(organizationId: number, shift: Shift): Promise<Shift>;
}

export default IShiftRepository;