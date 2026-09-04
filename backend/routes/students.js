const express = require("express");
const router = express.Router();

const pool = require("../db");

// GET all students
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                student_number AS "studentNumber",
                name,
                sex,
                dob,
                contact_number AS "contactNumber",
                email,
                provincial_address AS "provincialAddress",
                city_address AS "cityAddress",
                year_admitted AS "yearAdmitted",
                year_residency AS "yearResidency",
                year_graduated AS "yearGraduated",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM students
            ORDER BY name ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("GET students error:", error);
        res.status(500).json({
            error: "Failed to retrieve students"
        });
    }
});

// GET one student
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                student_number AS "studentNumber",
                name,
                sex,
                dob,
                contact_number AS "contactNumber",
                email,
                provincial_address AS "provincialAddress",
                city_address AS "cityAddress",
                year_admitted AS "yearAdmitted",
                year_residency AS "yearResidency",
                year_graduated AS "yearGraduated",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM students
            WHERE id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("GET student error:", error);
        res.status(500).json({
            error: "Failed to retrieve student"
        });
    }
});

// CREATE student
router.post("/", async (req, res) => {
    try {
        const {
            studentNumber,
            name,
            sex,
            dob,
            contactNumber,
            email,
            provincialAddress,
            cityAddress,
            yearAdmitted,
            yearResidency,
            yearGraduated
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: "Full name is required"
            });
        }

        const result = await pool.query(`
            INSERT INTO students (
                student_number,
                name,
                sex,
                dob,
                contact_number,
                email,
                provincial_address,
                city_address,
                year_admitted,
                year_residency,
                year_graduated
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
            )
            RETURNING
                id,
                student_number AS "studentNumber",
                name,
                sex,
                dob,
                contact_number AS "contactNumber",
                email,
                provincial_address AS "provincialAddress",
                city_address AS "cityAddress",
                year_admitted AS "yearAdmitted",
                year_residency AS "yearResidency",
                year_graduated AS "yearGraduated",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `, [
            studentNumber || null,
            name.trim(),
            sex || null,
            dob || null,
            contactNumber || null,
            email || null,
            provincialAddress || null,
            cityAddress || null,
            yearAdmitted || null,
            yearResidency || null,
            yearGraduated || null
        ]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("POST student error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "That student number is already in use."
            });
        }

        res.status(500).json({
            error: "Failed to create student"
        });
    }
});

// UPDATE student
router.put("/:id", async (req, res) => {
    try {
        const {
            studentNumber,
            name,
            sex,
            dob,
            contactNumber,
            email,
            provincialAddress,
            cityAddress,
            yearAdmitted,
            yearResidency,
            yearGraduated
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: "Full name is required"
            });
        }

        const result = await pool.query(`
            UPDATE students
            SET
                student_number = $1,
                name = $2,
                sex = $3,
                dob = $4,
                contact_number = $5,
                email = $6,
                provincial_address = $7,
                city_address = $8,
                year_admitted = $9,
                year_residency = $10,
                year_graduated = $11,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $12
            RETURNING
                id,
                student_number AS "studentNumber",
                name,
                sex,
                dob,
                contact_number AS "contactNumber",
                email,
                provincial_address AS "provincialAddress",
                city_address AS "cityAddress",
                year_admitted AS "yearAdmitted",
                year_residency AS "yearResidency",
                year_graduated AS "yearGraduated",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `, [
            studentNumber || null,
            name.trim(),
            sex || null,
            dob || null,
            contactNumber || null,
            email || null,
            provincialAddress || null,
            cityAddress || null,
            yearAdmitted || null,
            yearResidency || null,
            yearGraduated || null,
            req.params.id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("PUT student error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "That student number is already in use."
            });
        }

        res.status(500).json({
            error: "Failed to update student"
        });
    }
});

// DELETE student
router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM students WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("DELETE student error:", error);

        res.status(500).json({
            error: "Failed to delete student"
        });
    }
});

module.exports = router;