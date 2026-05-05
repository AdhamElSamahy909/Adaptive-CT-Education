import { useState } from "react";
import useUser from "../authentication/useUser";
import { Document, Page, pdfjs } from "react-pdf";
import useUploadLecture from "./useUploadLecture";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

function Lecture({
  urlStarter,
  isLoading,
  viewMode,
  setViewMode,
  topic,
  handleForwardClick,
  handleBackClick,
}) {
  const { role, styleChange } = useUser();
  const {
    uploadLecture,
    isLoading: isUploading,
    urlUploaded,
    reset,
  } = useUploadLecture();
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const url = urlUploaded || urlStarter;

  console.log("Lecture URL in Lecture Component:", url);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function previousPage() {
    setPageNumber((prev) => prev - 1);
    handleBackClick?.();
  }

  function nextPage() {
    setPageNumber((prev) => prev + 1);
    handleForwardClick?.();
  }

  return (
    <div className="min-h-screen bg-offwite">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark_blue mb-4">
            {topic === "loops"
              ? "Loops Lecture"
              : topic === "conditionals"
                ? "Conditionals Lecture"
                : "Sequential Lecture"}
          </h1>
          <p className="text-medium_blue text-lg">
            {role === "instructor"
              ? "Toggle between visual and verbal explanations"
              : ""}
          </p>
        </div>

        {/* Toggle Buttons */}
        {role === "instructor" && (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setViewMode("visual");
                  setNumPages(null);
                  reset();
                }}
                className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                  viewMode === "visual"
                    ? "bg-dark_blue text-white"
                    : "bg-light_blue text-dark_blue hover:bg-medium_blue hover:text-white"
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => {
                  setViewMode("verbal");
                  setNumPages(null);
                  reset();
                }}
                className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                  viewMode === "verbal"
                    ? "bg-dark_blue text-white"
                    : "bg-light_blue text-dark_blue hover:bg-medium_blue hover:text-white"
                }`}
              >
                Verbal
              </button>
            </div>

            <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-light_blue shadow-sm">
              <input
                type="file"
                accept=".pdf"
                value={selectedFile ? undefined : ""}
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="text-sm text-dark_blue file:cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-light_blue file:text-dark_blue hover:file:bg-medium_blue hover:file:text-white file:transition-colors"
              />
              <button
                onClick={() => {
                  if (!selectedFile) return;
                  uploadLecture(
                    {
                      topic: topic,
                      type: viewMode,
                      file: selectedFile,
                    },
                    {
                      onSuccess: () => setSelectedFile(null),
                    },
                  );
                }}
                disabled={!selectedFile || isUploading}
                className={`px-6 py-2 font-bold rounded-lg transition-colors ${
                  !selectedFile || isUploading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-dark_blue text-white hover:bg-medium_blue"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center min-h-[600px] justify-center border-t-4 border-medium_blue">
          {isLoading ? (
            <div className="text-medium_blue font-bold animate-pulse">
              Loading Lecture Slides...
            </div>
          ) : url ? (
            <div className="flex flex-col items-center w-full">
              <div
                className={`border-2 rounded-lg shadow-lg overflow-hidden min-h-[600px] bg-offwite ${numPages ? "border-light_blue" : "border-white"}`}
              >
                <Document
                  file={url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<div className="h-[600px]" />}
                >
                  <Page
                    pageNumber={pageNumber}
                    loading={<div className="h-[600px] w-[800px] bg-white" />}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="max-w-full"
                    width={800}
                  />
                </Document>
              </div>

              {numPages && !isLoading && (
                <div className="flex items-center gap-6 mt-8 p-4 bg-offwite rounded-xl border border-light_blue shadow-sm">
                  <button
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    className={`px-5 py-2 font-bold rounded-lg transition-colors ${
                      pageNumber <= 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-medium_blue text-white hover:bg-dark_blue"
                    }`}
                  >
                    &larr; Previous Slide
                  </button>
                  <p className="text-dark_blue font-bold text-lg w-32 text-center">
                    {pageNumber} / {numPages}
                  </p>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                    className={`px-5 py-2 font-bold rounded-lg transition-colors ${
                      pageNumber >= numPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-medium_blue text-white hover:bg-dark_blue"
                    }`}
                  >
                    Next Slide &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-500 font-bold bg-red-50 p-4 rounded-lg border border-red-200">
              No lecture content available for this mode yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lecture;
