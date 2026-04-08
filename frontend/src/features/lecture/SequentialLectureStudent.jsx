import useUser from "../authentication/useUser";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import { useState } from "react";
import useUpdateLearningStyle from "../bayesianNetworks/useUpdateLearningStyle";
import useGetLecture from "./useGetLecture";
import Lecture from "./Lecture";

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

function SequentialLectureStudent() {
  const { userId, lastPref, refetchUser } = useUser();
  const { visualScore, verbalScore } = useInferLearningStyle(userId);
  const { updateLearningStyle } = useUpdateLearningStyle(refetchUser);
  const [numOfBackClicks, setNumOfBackClicks] = useState(0);
  const [numOfForwardClicks, setNumOfForwardClicks] = useState(0);
  const { url, isLoading } = useGetLecture(
    getCurrentMode(lastPref, visualScore, verbalScore).toLowerCase(),
    "sequential",
  );

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

  return (
    <Lecture
      url={url}
      isLoading={isLoading}
      handleForwardClick={handleForwardClick}
      handleBackClick={handleBackClick}
    />
  );
}

export default SequentialLectureStudent;
