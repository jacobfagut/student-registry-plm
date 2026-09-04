const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const studentsRoutes = require("./routes/students");
const documentsRoutes = require("./routes/documents");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Student Registry API is running"
    });
});

console.log("studentsRoutes:", typeof studentsRoutes);
console.log("documentsRoutes:", typeof documentsRoutes);

app.use("/api/students", studentsRoutes);
app.use("/api/documents", documentsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});