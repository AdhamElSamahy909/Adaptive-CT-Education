import useUser from "../authentication/useUser";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import SequentialLectureVisual from "./SequentialLectureVisual";
import SequentialLectureVerbal from "./SequentialLectureVerbal";

function SequentialLecture() {
  const { userId } = useUser();
  const { data } = useInferLearningStyle(userId);
  const visualScore = data?.visualScore || 0;
  const verbalScore = data?.verbalScore || 0;

  if (visualScore > verbalScore) {
    return <SequentialLectureVisual />;
  } else {
    return <SequentialLectureVerbal />;
  }
}

export default SequentialLecture;
