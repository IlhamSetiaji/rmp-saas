import { Shift } from "@prisma/client";

interface IShiftRepository {
    getShifts(): Promise<Shift[]>;
    createShiftByOrganization(organizationId: number, shift: Shift): Promise<Shift>;
    getShiftsByOrganization(organizationId: number): Promise<Shift[]>;
    getShiftById(shiftId: number): Promise<Shift | null>;
    updateShiftById(shiftId: number, shift: Shift): Promise<Shift | null>;
    deleteShiftById(shiftId: number): Promise<Shift | null>;
    assignEmployeesToShift(shiftId: number, userIds: number[]): Promise<Shift | null>;
    getUsersByShiftId(shiftId: number): Promise<any>;
    resignEmployeesFromShift(shiftId: number, userIds: number[]): Promise<Shift | null>;
    checkIfUserExistInShift(shiftId: number, userId: number): Promise<boolean>;
}

export default IShiftRepository;