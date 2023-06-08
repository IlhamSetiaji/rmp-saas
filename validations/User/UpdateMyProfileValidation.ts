import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const UpdateMyProfileValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be string")
        .escape(),
    body("phone")
        .notEmpty()
        .withMessage("Phone is required")
        .isString()
        .withMessage("Phone must be string")
        .escape(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array());
        }
        next();
    },
];

export default UpdateMyProfileValidation;
