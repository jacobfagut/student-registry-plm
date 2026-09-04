import { useState } from "react";
import { createStudent } from "../services/api";

function StudentForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        studentNumber: "",
        name: "",
        sex: "",
        dob: "",
        contactNumber: "",
        email: "",
        provincialAddress: "",
        cityAddress: "",
        yearAdmitted: "",
        yearResidency: "",
        yearGraduated: ""
    });

    
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await createStudent(formData);

            onSuccess();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="student-form-container">
            <div className="student-form-header">
                <h2>Add Student</h2>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Student Number</label>
                    <input
                        type="text"
                        name="studentNumber"
                        value={formData.studentNumber}
                        onChange={handleChange}
                        placeholder="2026-00002"
                    />
                </div>

                <div className="form-group">
                    <label>Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Juan Dela Cruz"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Sex</label>
                    <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                    >
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="09123456789"
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                    />
                </div>

                <div className="form-group">
                    <label>Provincial Address</label>
                    <textarea
                        name="provincialAddress"
                        value={formData.provincialAddress}
                        onChange={handleChange}
                        placeholder="Provincial address"
                    />
                </div>

                <div className="form-group">
                    <label>City Address</label>
                    <textarea
                        name="cityAddress"
                        value={formData.cityAddress}
                        onChange={handleChange}
                        placeholder="City address"
                    />
                </div>

                <div className="form-group">
                    <label>Year Admitted</label>
                    <input
                        type="text"
                        name="yearAdmitted"
                        value={formData.yearAdmitted}
                        onChange={handleChange}
                        placeholder="2022"
                    />
                </div>

                <div className="form-group">
                    <label>Year Residency</label>
                    <input
                        type="text"
                        name="yearResidency"
                        value={formData.yearResidency}
                        onChange={handleChange}
                        placeholder="2024"
                    />
                </div>

                <div className="form-group">
                    <label>Year Graduated</label>
                    <input
                        type="text"
                        name="yearGraduated"
                        value={formData.yearGraduated}
                        onChange={handleChange}
                        placeholder="2026"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Student"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default StudentForm;

