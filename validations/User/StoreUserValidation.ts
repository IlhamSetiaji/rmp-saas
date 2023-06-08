import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const StoreUserValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be string")
        .escape(),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be email")
        .escape(),
    body("phone")
        .notEmpty()
        .withMessage("Phone is required")
        .isString()
        .withMessage("Phone must be string")
        .escape(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be string")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .escape(),
    body("password_confirmation")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .isString()
        .withMessage("Password confirmation must be string")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(
                    "Password confirmation does not match password"
                );
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array());
        }
        next();
    },
];

export default StoreUserValidation;
