import ShiftRepository from "../../repositories/Shift/ShiftRepository";
import IShiftService from "./IShiftService";

class ShiftService implements IShiftService {
    private shiftRepository: ShiftRepository;
    constructor() {
        this.shiftRepository = new ShiftRepository();
    }

    getShifts = async () => {
        return this.shiftRepository.getShifts();
    };
}

export default ShiftService;