import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStudents = async () => {
        try {
            setLoading(true);

            const response = await api.get("/students");

            setStudents(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load students.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>Student Registry</h1>
                    <p>Manage student records and documents.</p>
                </div>

                <button>
                    + Add Student
                </button>
            </div>

            <div className="stats">
                <div className="stat-card">
                    <h3>Total Students</h3>
                    <strong>{students.length}</strong>
                </div>
            </div>

            <div className="student-section">

                <div className="section-header">
                    <h2>Students</h2>

                    <input
                        type="text"
                        placeholder="Search students..."
                    />
                </div>

                {loading && <p>Loading students...</p>}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <table>
                        <thead>
                            <tr>
                                <th>Student Number</th>
                                <th>Name</th>
                                <th>Sex</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Year Graduated</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        {student.studentNumber || "-"}
                                    </td>

                                    <td>
                                        {student.name}
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
                                        <button>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>

        </div>
    );
}

export default Dashboard;