import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const CreatePresenceValidation = [
    body("latitude")
        .notEmpty()
        .withMessage("Latitude is required")
        .bail()
        .isFloat({
            min: -90,
            max: 90,
        })
        .withMessage("Latitude must be a number")
        .bail()
        .escape(),
    body("longitude")
        .notEmpty()
        .withMessage("Longitude is required")
        .bail()
        .isFloat({
            min: -180,
            max: 180,
        })
        .withMessage("Longitude must be a number")
        .bail()
        .escape(),
    body("accuracy")
        .notEmpty()
        .withMessage("Accuracy is required")
        .bail()
        .isInt({
            min: 100,
        })
        .withMessage("Accuracy must be a number")
        .bail()
        .escape(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array());
        }
        next();
    },
];

export default CreatePresenceValidation;
