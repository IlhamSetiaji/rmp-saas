import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { body, validationResult } from "express-validator";
import path from "path";
import fs from "fs-extra";

class TestController {
    private upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                const path = `./uploads/organization`;
                fs.mkdirsSync(path);
                callback(null, path);
            },
            filename: (req, file, cb) => {
                const extension = path.extname(file.originalname);
                const uniqueSuffix = `${Date.now()}-${Math.round(
                    Math.random() * 1e9
                )}`;
                cb(null, `file-${uniqueSuffix}${extension}`);
            },
        }),
        fileFilter: (req, file, cb: FileFilterCallback) => {
            const allowedExtensions = [".jpg", ".jpeg", ".png"]; // Add more allowed extensions if necessary
            const extension = path.extname(file.originalname);
            if (allowedExtensions.includes(extension)) {
                cb(null, true);
            } else {
                cb(new Error("Invalid file extension"));
            }
        },
    });

    public uploadFile(req: Request, res: Response): void {
        // Check for file upload errors
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        // Access the uploaded file through req.file and assign it to a variable
        const uploadedFile = req.file;

        // Delete the uploaded file after processing
        fs.unlink(uploadedFile.path, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });

        // Continue processing if validation passes
        // Your code to handle the uploaded file here...

        res.status(200).json({
            message: "File uploaded successfully",
            uploadedFile: uploadedFile.filename,
            name: req.body.name,
        });
    }

    public uploadMiddleware(): any {
        return [
            this.upload.single("file"),

            // Define additional validation rules if needed
            body("name").notEmpty().withMessage("Name is required"),
            // Add more validation rules as necessary

            this.uploadFile,
        ];
    }
}

export default TestController;
