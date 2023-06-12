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

    getShiftsByOrganization = async (req: Request, res: Response) => {
        try {
            const { organizationId } = req.params;
            const shifts = await this.shiftService.getShiftsByOrganization(Number(organizationId));
            return ResponseFormatter.success(res, shifts, 'Shifts retrieved successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    getShiftById = async (req: Request, res: Response) => {
        try {
            const { shiftId } = req.params;
            const shift = await this.shiftService.getShiftById(Number(shiftId));
            if(!shift) {
                return ResponseFormatter.notFound(res, 'Shift not found');
            }
            return ResponseFormatter.success(res, shift, 'Shift retrieved successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    updateShiftById = async (req: Request, res: Response) => {
        try {
            const { shiftId } = req.params;
            const shift = await this.shiftService.updateShiftById(Number(shiftId), req.body);
            return ResponseFormatter.success(res, shift, 'Shift updated successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    deleteShiftById = async (req: Request, res: Response) => {
        try {
            const { shiftId } = req.params;
            const shift = await this.shiftService.deleteShiftById(Number(shiftId));
            return ResponseFormatter.success(res, shift, 'Shift deleted successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    assignEmployeesToShift = async (req: Request, res: Response) => {
        try {
            const { shiftId } = req.params;
            const { userIds } = req.body;
            const shift = await this.shiftService.assignEmployeesToShift(Number(shiftId), userIds);
            return ResponseFormatter.success(res, shift, 'Shift updated successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    getUsersByShiftId = async (req: Request, res: Response) => {
        try {
            const { shiftId } = req.params;
            const shift = await this.shiftService.getUsersByShiftId(Number(shiftId));
            return ResponseFormatter.success(res, shift.users, 'Shift retrieved successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };

    resignEmployeesFromShift = async (req: Request, res: Response) => {
        try {
            const { shiftId } = req.params;
            const { userIds } = req.body;
            const shift = await this.shiftService.resignEmployeesFromShift(Number(shiftId), userIds);
            return ResponseFormatter.success(res, shift, 'Shift updated successfully');
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message);
        }
    };
}

export default new ShiftController();
