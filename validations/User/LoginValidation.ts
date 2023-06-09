import { body, validationResult } from "express-validator";
import ResponseFormatter from "../../helpers/ResponseFormatter";

const LoginValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid")
        .trim()
        .escape(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .escape(),
    (req: any, res: any, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array()[0].msg);
        }
        next();
    },
];

export default LoginValidation;