import { Shift } from "@prisma/client";

interface IShiftRepository {
    getShifts(): Promise<Shift[]>;
    createShiftByOrganization(organizationId: number, shift: Shift): Promise<Shift>;
    getShiftsByOrganization(organizationId: number): Promise<Shift[]>;
    getShiftById(shiftId: number): Promise<Shift | null>;
    updateShiftById(shiftId: number, shift: Shift): Promise<Shift | null>;
    deleteShiftById(shiftId: number): Promise<Shift | null>;
}

export default IShiftRepository;