import { useState } from "react";
import {
    updateStudent,
    deleteStudent
} from "../services/api";

const DOCUMENTS = [
    { key: "biodata", label: "Biodata" },
    { key: "birthCertificate", label: "Birth Certificate" },
    { key: "applicationForm", label: "Application Form" },
    { key: "tor", label: "TOR" },
    { key: "permanentRecord", label: "Student Permanent Record" },
    { key: "certificateCompletion", label: "Certificate of Completion" },
    { key: "rleSummary", label: "RLE Summary" },
    { key: "certificateGrades", label: "Certificate of Grades" }
];

function StudentCard({
    student,
    isOpen,
    onToggle,
    onDeleted,
    onUpdated
}) {

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        studentNumber: student.studentNumber || "",
        name: student.name || "",
        sex: student.sex || "",
        dob: student.dob || "",
        contactNumber: student.contactNumber || "",
        email: student.email || "",
        provincialAddress: student.provincialAddress || "",
        cityAddress: student.cityAddress || "",
        yearAdmitted: student.yearAdmitted || "",
        yearResidency: student.yearResidency || "",
        yearGraduated: student.yearGraduated || ""
    });

    const documents = student.documents || {};

    const completedDocuments = DOCUMENTS.filter(
        (doc) => documents[doc.key]?.checked
    ).length;

    const totalDocuments = DOCUMENTS.length;

    const isComplete =
        completedDocuments === totalDocuments;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setFormData({
            studentNumber: student.studentNumber || "",
            name: student.name || "",
            sex: student.sex || "",
            dob: student.dob || "",
            contactNumber: student.contactNumber || "",
            email: student.email || "",
            provincialAddress: student.provincialAddress || "",
            cityAddress: student.cityAddress || "",
            yearAdmitted: student.yearAdmitted || "",
            yearResidency: student.yearResidency || "",
            yearGraduated: student.yearGraduated || ""
        });

        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);

        setFormData({
            studentNumber: student.studentNumber || "",
            name: student.name || "",
            sex: student.sex || "",
            dob: student.dob || "",
            contactNumber: student.contactNumber || "",
            email: student.email || "",
            provincialAddress: student.provincialAddress || "",
            cityAddress: student.cityAddress || "",
            yearAdmitted: student.yearAdmitted || "",
            yearResidency: student.yearResidency || "",
            yearGraduated: student.yearGraduated || ""
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            await updateStudent(student.id, formData);

            setEditing(false);

            await onUpdated();

        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to update student.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${student.name || "this student"}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteStudent(student.id);

            onDeleted();

        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to delete student.");
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        try {
            return new Date(date).toLocaleDateString();
        } catch {
            return date;
        }
    };

    const getDocumentStatus = (key) => {
        return documents[key]?.checked;
    };

    return (
        <div
            className={`student-card ${
                isOpen ? "student-card-open" : ""
            }`}
        >

            {/* STUDENT SUMMARY */}
            <div
                className="student-card-header"
                onClick={onToggle}
            >

                <div className="student-number">
                    {student.studentNumber || "No student number"}
                </div>

                <div className="student-summary">
                    <h3>
                        {student.name || "Unnamed Student"}
                    </h3>

                    <span>
                        {student.sex || "—"}
                    </span>

                    <span>
                        Admitted: {student.yearAdmitted || "—"}
                    </span>
                </div>

                <div
                    className={`document-status ${
                        isComplete
                            ? "complete"
                            : completedDocuments === 0
                            ? "missing"
                            : "partial"
                    }`}
                >
                    {completedDocuments}/{totalDocuments} Documents
                </div>

                <div className="student-chevron">
                    {isOpen ? "▲" : "▼"}
                </div>

            </div>

            {/* EXPANDED CONTENT */}
            {isOpen && (
                <div className="student-card-body">

                    {/* INFORMATION */}
                    <div className="student-information">

                        <div className="section-title">
                            <h3>Student Information</h3>

                            {!editing && (
                                <button
                                    className="edit-btn"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="student-details-grid">

                            <Detail
                                label="Student Number"
                                name="studentNumber"
                                value={formData.studentNumber}
                                editing={editing}
                                onChange={handleChange}
                            />

                            <Detail
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                editing={editing}
                                onChange={handleChange}
                            />

                            {editing ? (
                                <div className="detail-item">
                                    <label>Sex</label>

                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>
                                    </select>
                                </div>
                            ) : (
                                <Detail
                                    label="Sex"
                                    value={formData.sex}
                                />
                            )}

                            <Detail
                                label="Date of Birth"
                                name="dob"
                                value={formData.dob}
                                editing={editing}
                                type="date"
                                displayValue={formatDate(student.dob)}
                                onChange={handleChange}
                            />

                            <Detail
                                label="Contact Number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                editing={editing}
                                onChange={handleChange}
                            />

                            <Detail
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                editing={editing}
                                onChange={handleChange}
                            />

                            <Detail
                                label="Provincial Address"
                                name="provincialAddress"
                                value={formData.provincialAddress}
                                editing={editing}
                                full
                                onChange={handleChange}
                            />

                            <Detail
                                label="City Address"
                                name="cityAddress"
                                value={formData.cityAddress}
                                editing={editing}
                                full
                                onChange={handleChange}
                            />

                            <Detail
                                label="Year Admitted"
                                name="yearAdmitted"
                                value={formData.yearAdmitted}
                                editing={editing}
                                onChange={handleChange}
                            />

                            <Detail
                                label="Year of Residency"
                                name="yearResidency"
                                value={formData.yearResidency}
                                editing={editing}
                                onChange={handleChange}
                            />

                            <Detail
                                label="Year Graduated"
                                name="yearGraduated"
                                value={formData.yearGraduated}
                                editing={editing}
                                onChange={handleChange}
                            />

                        </div>

                        {/* EDIT ACTIONS */}
                        {editing && (
                            <div className="edit-actions">

                                <button
                                    className="cancel-btn"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="save-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>
                        )}

                    </div>

                    {/* DOCUMENTS */}
                    <div className="documents-section">

                        <div className="section-title">
                            <div>
                                <h3>Required Documents</h3>

                                <p>
                                    {completedDocuments} of{" "}
                                    {totalDocuments} documents submitted
                                </p>
                            </div>
                        </div>

                        <div className="documents-grid">

                            {DOCUMENTS.map((doc) => {

                                const submitted =
                                    getDocumentStatus(doc.key);

                                return (
                                    <div
                                        key={doc.key}
                                        className={`document-item ${
                                            submitted
                                                ? "document-submitted"
                                                : "document-missing"
                                        }`}
                                    >

                                        <div className="document-icon">
                                            {submitted ? "✓" : "!"}
                                        </div>

                                        <div className="document-info">

                                            <strong>
                                                {doc.label}
                                            </strong>

                                            <span>
                                                {submitted
                                                    ? "Submitted"
                                                    : "Missing"}
                                            </span>

                                        </div>

                                        {documents[doc.key]?.fileURL && (
                                            <button
                                                className="view-document-btn"
                                                onClick={() =>
                                                    window.open(
                                                        documents[
                                                            doc.key
                                                        ].fileURL,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                        )}

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                    {/* DELETE */}
                    {!editing && (
                        <div className="student-actions">

                            <button
                                className="delete-btn"
                                onClick={handleDelete}
                            >
                                Delete Student
                            </button>

                        </div>
                    )}

                </div>
            )}
        </div>
    );
}


/* DETAIL COMPONENT */

function Detail({
    label,
    name,
    value,
    editing,
    type = "text",
    full = false,
    displayValue,
    onChange
}) {

    return (
        <div
            className={`detail-item ${
                full ? "detail-full" : ""
            }`}
        >

            <label>{label}</label>

            {editing ? (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                />
            ) : (
                <p>
                    {displayValue !== undefined
                        ? displayValue || "—"
                        : value || "—"}
                </p>
            )}

        </div>
    );
}

export default StudentCard;