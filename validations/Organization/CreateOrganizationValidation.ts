import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const CreateOrganizationValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long")
        .escape(),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Description must be at least 3 characters long")
        .escape(),
    body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isString()
        .withMessage("Address must be a string")
        .escape(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array());
        }
        next();
    },
];

export default CreateOrganizationValidation;
