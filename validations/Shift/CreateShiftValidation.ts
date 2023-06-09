import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const CreateShiftValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isString()
        .withMessage("Name must be a string")
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3 and 50 characters")
        .escape(),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isString()
        .withMessage("Description must be a string")
        .bail()
        .escape(),
    body("startAt")
        .notEmpty()
        .withMessage("Start at is required")
        .bail()
        .isTime({
            hourFormat: 'hour24',
            mode: 'withSeconds'
        })
        .withMessage("Start at must be a time")
        .bail()
        .escape(),
    body("endAt")
        .notEmpty()
        .withMessage("End at is required")
        .bail()
        .isTime({
            hourFormat: 'hour24',
            mode: 'withSeconds'
        })
        .withMessage("End at must be a time")
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

export default CreateShiftValidation;
