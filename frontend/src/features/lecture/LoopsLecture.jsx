import useUser from "../authentication/useUser";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import LoopsLectureVisual from "./LoopsLectureVisual";
import LoopsLectureVerbal from "./LoopsLectureVerbal";
import { useState } from "react";
import useUpdateLearningStyle from "../bayesianNetworks/useUpdateLearningStyle";

function LoopsLecture() {
  const { userId, lastPref, refetchUser } = useUser();
  const { visualScore, verbalScore } = useInferLearningStyle(userId);
  const { updateLearningStyle } = useUpdateLearningStyle(refetchUser);
  const [numOfBackClicks, setNumOfBackClicks] = useState(0);
  const [numOfForwardClicks, setNumOfForwardClicks] = useState(0);

  console.log("User ID:", userId);
  console.log("Last Preferred Learning Style:", lastPref);

  let currentMode;

  if (lastPref === "Unknown") {
    if (visualScore > verbalScore) {
      currentMode = "Visual";
    } else {
      currentMode = "Verbal";
    }
  } else {
    currentMode = lastPref;
  }

  const handleForwardClick = () => {
    const newForwardClicks = numOfForwardClicks + 1;

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

  if (currentMode === "Visual") {
    return (
      <LoopsLectureVisual
        numOfBackClicks={numOfBackClicks}
        setNumOfBackClicks={setNumOfBackClicks}
        handleForwardClick={handleForwardClick}
      />
    );
  } else {
    return (
      <LoopsLectureVerbal
        numOfBackClicks={numOfBackClicks}
        setNumOfBackClicks={setNumOfBackClicks}
        handleForwardClick={handleForwardClick}
      />
    );
  }
}

export default LoopsLecture;
