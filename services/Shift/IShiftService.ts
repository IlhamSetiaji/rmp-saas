import { Shift } from "@prisma/client";

interface IShiftService {
    getShifts(): Promise<Shift[]>;
    checkIfOrganizationExist(organizationId: number): Promise<boolean>;
    createShiftByOrganization(organizationId: number, shift: Shift): Promise<Shift>;
    getShiftsByOrganization(organizationId: number): Promise<Shift[]>;
    getShiftById(shiftId: number): Promise<Shift | null>;
    updateShiftById(shiftId: number, shift: Shift): Promise<Shift | null>;
    deleteShiftById(shiftId: number): Promise<Shift | null>;
    assignEmployeesToShift(shiftId: number, userId: number[]): Promise<any>;
}

export default IShiftService;