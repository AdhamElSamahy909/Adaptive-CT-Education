import { useState } from "react";
import useGetLecture from "./useGetLecture";
import Lecture from "./Lecture";
import useGetTopicName from "../../hooks/useGetTopicName";

function SequentialLectureInstructor() {
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

export default SequentialLectureInstructor;
