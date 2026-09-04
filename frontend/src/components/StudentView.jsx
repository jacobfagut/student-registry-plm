
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getStudent } from "../services/api";
import DocumentManager from "./DocumentManager";

function StudentView({ studentId, onClose }) {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStudent = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getStudent(studentId);
                setStudent(data);
            } catch (err) {
                console.error("Failed to load student:", err);
                setError(err.message || "Failed to load student.");
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, [studentId]);

    // ESC key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Disable background scrolling
    useEffect(() => {
        const oldOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = oldOverflow;
        };
    }, []);

    const overlay = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box"
    };

    const modal = {
        position: "relative",
        width: "100%",
        maxWidth: "1100px",
        maxHeight: "90vh",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
    };

    const header = {
        padding: "22px 26px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexShrink: 0,
        backgroundColor: "#ffffff"
    };

    const closeButton = {
        width: "40px",
        height: "40px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#f3f4f6",
        color: "#111827",
        fontSize: "26px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };

    const content = {
        overflowY: "auto",
        padding: "24px",
        backgroundColor: "#f8fafc",
        flex: 1
    };

    const section = {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "18px"
    };

    const grid = {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "18px"
    };

    const footer = {
        padding: "16px 26px",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "#ffffff",
        flexShrink: 0
    };

    const closeFooterButton = {
        padding: "9px 18px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        backgroundColor: "#ffffff",
        color: "#374151",
        cursor: "pointer"
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div
            style={overlay}
            onMouseDown={handleOverlayClick}
        >
            <div
                style={modal}
                onMouseDown={(event) => event.stopPropagation()}
            >

                {/* HEADER */}
                <div style={header}>

                    <div>
                        <h2
                            style={{
                                margin: "0 0 5px",
                                fontSize: "24px",
                                color: "#111827"
                            }}
                        >
                            Student Profile
                        </h2>

                        {student && (
                            <>
                                <div
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#374151"
                                    }}
                                >
                                    {student.name || "Unnamed Student"}
                                </div>

                                <div
                                    style={{
                                        marginTop: "4px",
                                        color: "#6b7280",
                                        fontSize: "13px"
                                    }}
                                >
                                    Student Number:{" "}
                                    {student.studentNumber || "Missing"}
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        style={closeButton}
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* LOADING */}
                {loading && (
                    <div
                        style={{
                            ...content,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "300px"
                        }}
                    >
                        Loading student...
                    </div>
                )}


                {/* ERROR */}
                {!loading && error && (
                    <div style={content}>
                        <div
                            style={{
                                padding: "20px",
                                backgroundColor: "#fef2f2",
                                color: "#b91c1c",
                                borderRadius: "8px"
                            }}
                        >
                            {error}
                        </div>
                    </div>
                )}


                {/* STUDENT */}
                {!loading && !error && student && (
                    <>
                        <div style={content}>

                            {/* PERSONAL INFORMATION */}

                            <div style={section}>

                                <h3
                                    style={{
                                        margin: "0 0 18px",
                                        fontSize: "17px"
                                    }}
                                >
                                    Personal Information
                                </h3>

                                <div style={grid}>

                                    <div>
                                        <strong>Full Name</strong>

                                        <p>
                                            {student.name || "Missing"}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>Student Number</strong>

                                        <p>
                                            {student.studentNumber || "Missing"}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>Sex</strong>

                                        <p>
                                            {student.sex || "Missing"}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>Date of Birth</strong>

                                        <p>
                                            {student.dob
                                                ? new Date(
                                                    student.dob
                                                ).toLocaleDateString()
                                                : "Missing"}
                                        </p>
                                    </div>

                                </div>
                            </div>


                            {/* CONTACT */}

                            <div style={section}>

                                <h3
                                    style={{
                                        margin: "0 0 18px",
                                        fontSize: "17px"
                                    }}
                                >
                                    Contact Information
                                </h3>

                                <div style={grid}>

                                    <div>
                                        <strong>Contact Number</strong>

                                        <p>
                                            {student.contactNumber ||
                                                "Missing"}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>Email Address</strong>

                                        <p>
                                            {student.email ||
                                                "Missing"}
                                        </p>
                                    </div>

                                </div>
                            </div>


                            {/* ADDRESS */}

                            <div style={section}>

                                <h3
                                    style={{
                                        margin: "0 0 18px",
                                        fontSize: "17px"
                                    }}
                                >
                                    Address
                                </h3>

                                <div style={grid}>

                                    <div>
                                        <strong>
                                            Provincial Address
                                        </strong>

                                        <p>
                                            {student.provincialAddress ||
                                                "Missing"}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>
                                            City Address
                                        </strong>

                                        <p>
                                            {student.cityAddress ||
                                                "Missing"}
                                        </p>
                                    </div>

                                </div>
                            </div>


                            {/* ACADEMIC */}

                            <div style={section}>

                                <h3
                                    style={{
                                        margin: "0 0 18px",
                                        fontSize: "17px"
                                    }}
                                >
                                    Academic Information
                                </h3>

                                <div style={grid}>

                                    <div>
                                        <strong>
                                            Year Admitted
                                        </strong>

                                        <p>
                                            {student.yearAdmitted ||
                                                "Missing"}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>
                                            Year of Residency
                                        </strong>

                                        <p>
                                            {student.yearResidency ||
                                                "Missing"}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>
                                            Year Graduated
                                        </strong>

                                        <p>
                                            {student.yearGraduated ||
                                                "Missing"}
                                        </p>
                                    </div>

                                </div>
                            </div>


                            {/* DOCUMENTS */}

                            <div style={section}>

                                <h3
                                    style={{
                                        margin: "0 0 18px",
                                        fontSize: "17px"
                                    }}
                                >
                                    Documents
                                </h3>

                                <p
                                    style={{
                                        color: "#6b7280",
                                        marginTop: "-8px"
                                    }}
                                >
                                    Student documents and records
                                </p>

                                <DocumentManager
                                    studentId={studentId}
                                />

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div style={footer}>

                            <button
                                type="button"
                                style={closeFooterButton}
                                onClick={onClose}
                            >
                                Close
                            </button>

                        </div>
                    </>
                )}

            </div>
        </div>
    );

    // THIS IS THE CRITICAL PART
    return createPortal(
        modalContent,
        document.body
    );
}

export default StudentView;
