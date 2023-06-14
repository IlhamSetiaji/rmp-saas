import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const createLocationValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isString()
        .withMessage("Name must be string")
        .bail()
        .isLength({ min: 3, max: 255 })
        .withMessage("Name must be between 3 and 255 characters")
        .escape(),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isString()
        .withMessage("Description must be string")
        .bail()
        .escape(),
    body("latitude")
        .notEmpty()
        .withMessage("Latitude is required")
        .bail()
        .isFloat({
            min: -90,
            max: 90,
        })
        .withMessage("Latitude must be float")
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
        .withMessage("Longitude must be float")
        .bail()
        .escape(),
    body("interval")
        .notEmpty()
        .withMessage("Interval is required")
        .bail()
        .isInt({
            min: 60,
        })
        .withMessage("Interval must be integer")
        .bail()
        .escape(),
    body("range")
        .notEmpty()
        .withMessage("Range is required")
        .bail()
        .isInt({
            min: 10,
        })
        .withMessage("Range must be integer")
        .bail()
        .escape(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.badRequest(res, errors.array());
        }
        next();
    },
];

export default createLocationValidation;
