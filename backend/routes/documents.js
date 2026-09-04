const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const pool = require("../db");

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});


// ==========================================
// GET DOCUMENTS FOR STUDENT
// ==========================================

router.get("/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        const result = await pool.query(`
            SELECT
                id,
                student_id AS "studentId",
                document_type AS "documentType",
                file_name AS "fileName",
                file_path AS "filePath",
                uploaded_at AS "uploadedAt"
            FROM student_documents
            WHERE student_id = $1
            ORDER BY uploaded_at DESC
        `, [studentId]);

        res.json(result.rows);

    } catch (error) {
        console.error("GET documents error:", error);

        res.status(500).json({
            error: "Failed to retrieve documents"
        });
    }
});


// ==========================================
// UPLOAD DOCUMENT
// ==========================================

router.post(
    "/:studentId",
    upload.single("document"),
    async (req, res) => {

        try {
            const { studentId } = req.params;
            const { documentType } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    error: "No document file was uploaded."
                });
            }

            if (!documentType) {
                // Delete uploaded file if document type is missing
                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    error: "Document type is required."
                });
            }

            // Check if student exists
            const student = await pool.query(
                "SELECT id FROM students WHERE id = $1",
                [studentId]
            );

            if (student.rows.length === 0) {

                fs.unlinkSync(req.file.path);

                return res.status(404).json({
                    error: "Student not found."
                });
            }

            // Save document information to PostgreSQL
            const result = await pool.query(`
                INSERT INTO student_documents (
                    student_id,
                    document_type,
                    file_name,
                    file_path
                )
                VALUES ($1, $2, $3, $4)
                RETURNING
                    id,
                    student_id AS "studentId",
                    document_type AS "documentType",
                    file_name AS "fileName",
                    file_path AS "filePath",
                    uploaded_at AS "uploadedAt"
            `, [
                studentId,
                documentType,
                req.file.originalname,
                `/uploads/${req.file.filename}`
            ]);

            res.status(201).json({
                success: true,
                message: "Document uploaded successfully.",
                document: result.rows[0]
            });

        } catch (error) {

            console.error("POST document error:", error);

            // Remove physical file if database insert failed
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            // Duplicate document type
            if (error.code === "23505") {
                return res.status(409).json({
                    error: "This student already has this document type."
                });
            }

            res.status(500).json({
                error: "Failed to upload document."
            });
        }
    }
);


// ==========================================
// DELETE DOCUMENT
// ==========================================

router.delete("/:documentId", async (req, res) => {

    try {

        const { documentId } = req.params;

        const result = await pool.query(`
            DELETE FROM student_documents
            WHERE id = $1
            RETURNING file_path
        `, [documentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Document not found."
            });
        }

        // Delete physical file
        const filePath = result.rows[0].file_path;

        if (filePath) {
            const fullPath = path.join(
                __dirname,
                "..",
                filePath.replace("/uploads/", "uploads/")
            );

            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        res.json({
            success: true,
            message: "Document deleted successfully."
        });

    } catch (error) {

        console.error("DELETE document error:", error);

        res.status(500).json({
            error: "Failed to delete document."
        });
    }
});


// ==========================================
// MULTER ERROR HANDLER
// ==========================================

router.use((error, req, res, next) => {

    if (error instanceof multer.MulterError) {

        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                error: "File is too large. Maximum size is 10 MB."
            });
        }

        return res.status(400).json({
            error: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    next();
});


module.exports = router;