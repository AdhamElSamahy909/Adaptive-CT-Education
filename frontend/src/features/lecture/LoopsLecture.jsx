import useUser from "../authentication/useUser";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import LoopsLectureVisual from "./LoopsLectureVisual";
import LoopsLectureVerbal from "./LoopsLectureVerbal";
import { useEffect } from "react";
import { useState } from "react";
import useUpdateLearningStyle from "../bayesianNetworks/useUpdateLearningStyle";
import { useRef } from "react";

function LoopsLecture() {
  const { userId, lastPref } = useUser();
  const { visualScore, verbalScore } = useInferLearningStyle(userId);
  const { updateLearningStyle } = useUpdateLearningStyle();
  const [numOfBackClicks, setNumOfBackClicks] = useState(0);
  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    updateLearningStyle({
      userId,
      numOfBackClicks,
      currentMode,
    });
  }, [numOfBackClicks, userId, updateLearningStyle, currentMode]);

  if (currentMode === "Visual") {
    return (
      <LoopsLectureVisual
        numOfBackClicks={numOfBackClicks}
        setNumOfBackClicks={setNumOfBackClicks}
      />
    );
  } else {
    return (
      <LoopsLectureVerbal
        numOfBackClicks={numOfBackClicks}
        setNumOfBackClicks={setNumOfBackClicks}
      />
    );
  }
}

export default LoopsLecture;
