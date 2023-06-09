import { PrismaClient } from "@prisma/client";
import IShiftRepository from "./IShiftRepository";

class ShiftRepository implements IShiftRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async getShifts() {
        return this.prisma.shift.findMany();
    }
}

export default ShiftRepository;