import PresenceService from "../services/Presence/PresenceService";
import ResponseFormatter from "../helpers/ResponseFormatter";

class PresenceController {
    private presenceService: PresenceService;
    constructor() {
        this.presenceService = new PresenceService();
    }

    public getPresence = async (req: any, res: any): Promise<any> => {
        try {
            const presence = await this.presenceService.getPresence();
            return ResponseFormatter.success(res, presence, "Presence retrieved successfully.");
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public createPresenceByShift = async (req: any, res: any): Promise<any> => {
        try {
            const { shiftId } = req.params;
            const presence = await this.presenceService.createPresenceByShift(Number(shiftId), req.body);
            return ResponseFormatter.success(res, presence, "Presence created successfully.");
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public getPresencesByShiftId = async (req: any, res: any): Promise<any> => {
        try {
            const { shiftId } = req.params;
            const presences = await this.presenceService.getPresencesByShiftId(Number(shiftId));
            return ResponseFormatter.success(res, presences, "Presences retrieved successfully.");
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public updatePresenceById = async (req: any, res: any): Promise<any> => {
        try {
            const { presenceId } = req.params;
            const presence = await this.presenceService.updatePresenceById(Number(presenceId), req.body);
            return ResponseFormatter.success(res, presence, "Presence updated successfully.");
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };

    public deletePresenceById = async (req: any, res: any): Promise<any> => {
        try {
            const { presenceId } = req.params;
            const presence = await this.presenceService.deletePresenceById(Number(presenceId));
            return ResponseFormatter.success(res, presence, "Presence deleted successfully.");
        } catch (error: any) {
            return ResponseFormatter.error(res, error.message, error.code);
        }
    };
}

export default new PresenceController();