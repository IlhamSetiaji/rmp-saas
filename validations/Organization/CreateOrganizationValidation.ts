import { body } from "express-validator";

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

export default CreateOrganizationValidation;
