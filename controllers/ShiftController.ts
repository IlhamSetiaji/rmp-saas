import ShiftService from "../services/Shift/ShiftService";
import ResponseFormatter from "../helpers/ResponseFormatter";
import { Request, Response } from "express";

class ShiftController {
    private shiftService: ShiftService;
    constructor() {
        this.shiftService = new ShiftService();
    }

    getShifts = async (req: Request, res: Response) => {
        try {
            const shifts = await this.shiftService.getShifts();
            return ResponseFormatter.success(res, shifts, 'Shifts retrieved successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    createShiftByOrganization = async (req: Request, res: Response) => {
        try {
            const { organizationId } = req.params;
            const shift = await this.shiftService.createShiftByOrganization(Number(organizationId), req.body);
            return ResponseFormatter.success(res, shift, 'Shift created successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };
}

export default new ShiftController();
