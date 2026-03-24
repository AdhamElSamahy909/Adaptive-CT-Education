import useUser from "../authentication/useUser";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import ConditionalLectureVisual from "./ConditionalLectureVisual";
import ConditionalLectureVerbal from "./ConditionalLectureVerbal";

function ConditionalsLecture() {
  const { userId } = useUser();
  const { data } = useInferLearningStyle(userId);
  const visualScore = data?.visualScore || 0;
  const verbalScore = data?.verbalScore || 0;

  if (visualScore > verbalScore) {
    return <ConditionalLectureVisual />;
  } else {
    return <ConditionalLectureVerbal />;
  }
}

export default ConditionalsLecture;
