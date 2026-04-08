import { useState } from "react";
import LoopsLectureVisual from "./LoopsLectureVisual";
import useGetLecture from "./useGetLecture";
import Lecture from "./Lecture";
import useGetTopicName from "../../hooks/useGetTopicName";

function LoopsLectureInstructor() {
  const [viewMode, setViewMode] = useState("visual"); // "visual" or "verbal"
  const topic = useGetTopicName();
  const { url, isLoading } = useGetLecture(viewMode, topic);

  return (
    <Lecture
      urlStarter={url}
      isLoading={isLoading}
      viewMode={viewMode}
      setViewMode={setViewMode}
      topic={topic}
    />
  );
}

export default LoopsLectureInstructor;

// {/* <div className="min-h-screen bg-offwite">
//       <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-dark_blue mb-4">
//             Loops Lecture
//           </h1>
//           <p className="text-medium_blue text-lg">
//             Toggle between visual and verbal explanations
//           </p>
//         </div>

//         {/* Toggle Buttons */}
//         <div className="flex gap-4 mb-8">
//           <button
//             onClick={() => setViewMode("visual")}
//             className={`px-6 py-3 font-bold rounded-lg transition-colors ${
//               viewMode === "visual"
//                 ? "bg-dark_blue text-white"
//                 : "bg-light_blue text-dark_blue hover:bg-medium_blue hover:text-white"
//             }`}
//           >
//             Visual
//           </button>
//           <button
//             onClick={() => setViewMode("verbal")}
//             className={`px-6 py-3 font-bold rounded-lg transition-colors ${
//               viewMode === "verbal"
//                 ? "bg-dark_blue text-white"
//                 : "bg-light_blue text-dark_blue hover:bg-medium_blue hover:text-white"
//             }`}
//           >
//             Verbal
//           </button>
//         </div>

//         {/* Content */}
//         <div className="bg-white rounded-xl shadow-md p-8">
//           {viewMode === "visual" ? (
//             <LoopsLectureVisual />
//           ) : (
//             <LoopsLectureVerbal />
//           )}
//         </div>
//       </div>
//     </div> */}
