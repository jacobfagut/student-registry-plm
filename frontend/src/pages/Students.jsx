    import { useEffect, useState } from "react";
import { getStudents } from "../services/api";
import StudentForm from "../components/StudentForm";
import StudentView from "../components/StudentView";

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    // ==========================================
    // LOAD STUDENTS
    // ==========================================
    const loadStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            console.error("Load students error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // ==========================================
    // STUDENT CREATED
    // ==========================================
    const handleStudentCreated = () => {
        setShowForm(false);
        loadStudents();
    };

    // ==========================================
    // CLOSE STUDENT MODAL
    // ==========================================
    const handleCloseStudentView = () => {
        setSelectedStudentId(null);
    };

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return (
            <div className="page">
                <h1>Student Registry</h1>
                <p>Loading students...</p>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================
    if (error) {
        return (
            <div className="page">
                <div className="page-header">
                    <div>
                        <h1>Student Registry</h1>
                        <p>Manage registered students</p>
                    </div>

                    <button onClick={loadStudents}>
                        Try Again
                    </button>
                </div>

                <div className="error-message">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN PAGE
    // ==========================================
    return (
        <>
            <div className="page">

                {/* PAGE HEADER */}
                <div className="page-header">
                    <div>
                        <h1>Student Registry</h1>
                        <p>Manage registered students</p>
                    </div>

                    <button onClick={() => setShowForm(true)}>
                        + Add Student
                    </button>
                </div>

                {/* ADD STUDENT FORM */}
                {showForm && (
                    <StudentForm
                        onSuccess={handleStudentCreated}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {/* STUDENT COUNT */}
                <div className="student-count">
                    Total Students: {students.length}
                </div>

                {/* STUDENT TABLE */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Student Number</th>
                                <th>Name</th>
                                <th>Sex</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Year Graduated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id}>
                                        <td>
                                            {student.studentNumber || "-"}
                                        </td>

                                        <td>
                                            {student.name || "-"}
                                        </td>

                                        <td>
                                            {student.sex || "-"}
                                        </td>

                                        <td>
                                            {student.email || "-"}
                                        </td>

                                        <td>
                                            {student.contactNumber || "-"}
                                        </td>

                                        <td>
                                            {student.yearGraduated || "-"}
                                        </td>

                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="view-button"
                                                    onClick={() =>
                                                        setSelectedStudentId(
                                                            student.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        console.log(
                                                            "Edit student:",
                                                            student.id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        console.log(
                                                            "Delete student:",
                                                            student.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==========================================
                STUDENT MODAL
                IMPORTANT:
                This is OUTSIDE the .page container.
            ========================================== */}

            {selectedStudentId !== null && (
                <StudentView
                    studentId={selectedStudentId}
                    onClose={handleCloseStudentView}
                />
            )}
        </>
    );
}

export default Students;

