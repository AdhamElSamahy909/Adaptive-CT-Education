import useUser from "../authentication/useUser";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import { useState } from "react";
import useUpdateLearningStyle from "../bayesianNetworks/useUpdateLearningStyle";
import useGetLecture from "./useGetLecture";
import Lecture from "./Lecture";
import useGetTopicName from "../../hooks/useGetTopicName";
import { Document, Page, pdfjs } from "react-pdf";
import useChangeIsStyleChanged from "../bayesianNetworks/useChangeIsStyleChanged";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

function getCurrentMode(lastPref, visualScore, verbalScore) {
  if (lastPref === "Unknown") {
    if (visualScore > verbalScore) {
      return "Visual";
    } else {
      return "Verbal";
    }
  } else {
    return lastPref;
  }
}

function xor(a, b) {
  return (a || b) && !(a && b);
}

function LectureStudent() {
  const { userId, lastPref, refetchUser, styleChange } = useUser();
  const { visualScore, verbalScore } = useInferLearningStyle(userId);
  const { updateLearningStyle } = useUpdateLearningStyle(refetchUser);
  const [numOfBackClicks, setNumOfBackClicks] = useState(0);
  const [numOfForwardClicks, setNumOfForwardClicks] = useState(0);
  const topic = useGetTopicName();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { url: urlStarter, isLoading } = useGetLecture(
    getCurrentMode(lastPref, visualScore, verbalScore)?.toLowerCase(),
    topic,
  );
  const { submitChangeIsStyleChanged } = useChangeIsStyleChanged();

  const showStyleChangeModal = !xor(
    styleChange?.isDetected && styleChange?.isChanged,
  );

  console.log(
    "Type: ",
    getCurrentMode(lastPref, visualScore, verbalScore)?.toLowerCase(),
    "Topic: ",
    topic,
  );

  console.log("Topic in LectureStudent: ", topic);

  console.log("User ID:", userId);
  console.log(
    "Last Preferred Learning Style:",
    getCurrentMode(lastPref, visualScore, verbalScore),
  );

  const currentMode = getCurrentMode(lastPref, visualScore, verbalScore);

  const handleBackClick = () => setNumOfBackClicks((prev) => prev + 1);

  const handleForwardClick = () => {
    console.log("Forward Clicked. Current Forward Clicks: ");
    const newForwardClicks = numOfForwardClicks + 1;
    console.log("Forward Clicked. Total Forward Clicks: ", newForwardClicks);

    if (newForwardClicks >= 4) {
      setNumOfBackClicks(0);
      setNumOfForwardClicks(0);

      updateLearningStyle({
        userId,
        numOfBackClicks,
        numOfForwardClicks: newForwardClicks,
        currentMode,
      });
    } else {
      setNumOfForwardClicks(newForwardClicks);
    }
  };

  const url = urlStarter;

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

  function handleStyleChangeModalClose() {
    submitChangeIsStyleChanged({ userId });
  }

  return (
    <>
      {showStyleChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-t-4 border-medium_blue transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <svg
                  className="h-8 w-8 text-medium_blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark_blue mb-3">
                Learning Style Updated!
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We noticed a pattern in your recent interactions, so we've
                slightly adjusted your learning style preferences to better suit
                you. We hope this enhances your learning experience!
              </p>
              <button
                onClick={handleStyleChangeModalClose}
                className="w-full bg-medium_blue text-white font-bold py-3 px-4 rounded-xl hover:bg-dark_blue transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-offwite">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark_blue mb-4">
              {topic === "loops"
                ? "Loops Lecture"
                : topic === "conditionals"
                  ? "Conditionals Lecture"
                  : "Sequential Lecture"}
            </h1>
          </div>

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
    </>
  );
}

export default LectureStudent;
