import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const DOCUMENT_TYPES = [
    "Biodata",
    "Birth Certificate",
    "Application Form",
    "TOR / Student Permanent Record",
    "Certificate of Completion",
    "RLE Summary",
    "Certificate of Grades"
];

function DocumentManager({ studentId }) {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [uploadingType, setUploadingType] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState({});


    // ==========================================
    // LOAD DOCUMENTS
    // ==========================================

    const loadDocuments = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/documents/${studentId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to load documents"
                );
            }

            setDocuments(data);

        } catch (err) {

            console.error(err);
            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (studentId) {
            loadDocuments();
        }

    }, [studentId]);


    // ==========================================
    // FIND DOCUMENT
    // ==========================================

    const getDocument = (documentType) => {

        return documents.find(
            (document) =>
                document.documentType === documentType
        );

    };


    // ==========================================
    // FILE SELECT
    // ==========================================

    const handleFileChange = (
        documentType,
        event
    ) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setSelectedFiles((previous) => ({
            ...previous,
            [documentType]: file
        }));

    };


    // ==========================================
    // UPLOAD
    // ==========================================

    const handleUpload = async (documentType) => {

        const file =
            selectedFiles[documentType];

        if (!file) {

            setError(
                `Please select a file for ${documentType}.`
            );

            return;
        }

        try {

            setUploadingType(documentType);
            setError("");

            const formData = new FormData();

            formData.append(
                "documentType",
                documentType
            );

            formData.append(
                "document",
                file
            );

            const response = await fetch(
                `${API_URL}/documents/${studentId}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to upload document"
                );
            }


            // Remove selected file
            setSelectedFiles((previous) => {

                const updated = {
                    ...previous
                };

                delete updated[documentType];

                return updated;

            });


            // Refresh documents
            await loadDocuments();

        } catch (err) {

            console.error(err);
            setError(err.message);

        } finally {

            setUploadingType(null);

        }

    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (
        documentId
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            const response = await fetch(
                `${API_URL}/documents/${documentId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to delete document"
                );

            }

            await loadDocuments();

        } catch (err) {

            console.error(err);
            setError(err.message);

        }

    };


    // ==========================================
    // VIEW
    // ==========================================

    const handleView = (filePath) => {

        window.open(
            `${API_URL.replace("/api", "")}${filePath}`,
            "_blank"
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <p>
                Loading documents...
            </p>
        );

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="document-manager">

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            <div className="document-list">

                {DOCUMENT_TYPES.map(
                    (documentType) => {

                        const document =
                            getDocument(
                                documentType
                            );

                        const isUploading =
                            uploadingType ===
                            documentType;

                        return (

                            <div
                                className="document-card"
                                key={documentType}
                            >

                                <div className="document-card-info">

                                    <strong>
                                        {documentType}
                                    </strong>

                                    {document ? (

                                        <span className="document-status available">
                                            ✓ Available
                                        </span>

                                    ) : (

                                        <span className="document-status missing">
                                            — Missing
                                        </span>

                                    )}

                                </div>


                                <div className="document-card-actions">

                                    {document ? (

                                        <>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleView(
                                                        document.filePath
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        document.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </>

                                    ) : (

                                        <>

                                            <input
                                                type="file"
                                                id={`file-${documentType}`}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(event) =>
                                                    handleFileChange(
                                                        documentType,
                                                        event
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                disabled={
                                                    isUploading ||
                                                    !selectedFiles[
                                                        documentType
                                                    ]
                                                }
                                                onClick={() =>
                                                    handleUpload(
                                                        documentType
                                                    )
                                                }
                                            >
                                                {isUploading
                                                    ? "Uploading..."
                                                    : "Upload"}
                                            </button>

                                        </>

                                    )}

                                </div>


                                {document && (

                                    <small className="document-file-name">

                                        {document.fileName}

                                    </small>

                                )}

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );
}

export default DocumentManager;

