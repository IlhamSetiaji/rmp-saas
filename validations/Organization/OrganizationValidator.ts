import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const CreateOrganizationValidation = [
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
    body("image")
        .isString()
        .withMessage("Image must be a string")
        .escape()
        .custom((value, { req }) => {
            if (
                req.file.mimetype === "application/jpg" ||
                req.file.mimetype === "application/jpeg" ||
                req.file.mimetype === "application/png"
            ) {
                return true;
            } else {
                throw new Error("Image must be a valid file type");
            }
        })
        .optional({ nullable: true })
];

export const CreateOrganizationValidationHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
};