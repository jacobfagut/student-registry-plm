const API_URL = "http://localhost:5000/api";

export async function getStudents() {
    const response = await fetch(`${API_URL}/students`);

    if (!response.ok) {
        throw new Error("Failed to load students");
    }

    return response.json();
}

export async function getStudent(id) {
    const response = await fetch(`${API_URL}/students/${id}`);

    if (!response.ok) {
        throw new Error("Failed to load student");
    }

    return response.json();
}

export async function createStudent(student) {
    const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to create student");
    }

    return data;
}

export async function updateStudent(id, student) {
    const response = await fetch(`${API_URL}/students/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update student");
    }

    return data;
}

export async function deleteStudent(id) {
    const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to delete student");
    }

    return data;
}
export async function getDocuments(studentId) { const response = await fetch( `${API_URL}/documents/${studentId}` ); const data = await response.json(); if (!response.ok) { throw new Error( data.error || "Failed to load documents" ); } return data; } export async function uploadDocument( studentId, documentType, file ) { const formData = new FormData(); formData.append("documentType", documentType); formData.append("document", file); const response = await fetch( `${API_URL}/documents/${studentId}`, { method: "POST", body: formData } ); const data = await response.json(); if (!response.ok) { throw new Error( data.error || "Failed to upload document" ); } return data; } export async function deleteDocument(documentId) { const response = await fetch( `${API_URL}/documents/${documentId}`, { method: "DELETE" } ); const data = await response.json(); if (!response.ok) { throw new Error( data.error || "Failed to delete document" ); } return data; }