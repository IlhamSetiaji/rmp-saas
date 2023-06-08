import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const AssignUsersToOrganizationValidation = [
    body("userId")
        .notEmpty()
        .withMessage("User Id is required")
        .bail()
        .isArray()
        .withMessage("User Id must be an array")
        .escape(),
    body("userId.*")
        .isNumeric()
        .withMessage("User Id must be a number")
        .escape(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array());
        }
        next();
    },
];

export default AssignUsersToOrganizationValidation;
