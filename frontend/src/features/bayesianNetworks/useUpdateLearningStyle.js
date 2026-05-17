import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function updateLearningStyleApi(
  userId,
  numOfBackClicks,
  numOfForwardClicks,
  currentMode,
  visualScore,
  verbalScore,
) {
  try {
    console.log("Updating learning style for user: ", userId);
    const { data } = await axiosInstance.post(
      `bayesian-networks/learning-style/update/${userId}`,
      {
        userId,
        numOfBackClicks,
        numOfForwardClicks,
        currentMode,
        visualScore,
        verbalScore,
      },
    );

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to update learning style",
    );
  }
}

export default function useUpdateLearningStyle(refetchUser) {
  const {
    mutate: updateLearningStyle,
    data,
    isLoading,
    error,
  } = useMutation({
    mutationFn: ({
      userId,
      numOfBackClicks,
      numOfForwardClicks,
      currentMode,
      visualScore,
      verbalScore,
    }) =>
      updateLearningStyleApi(
        userId,
        numOfBackClicks,
        numOfForwardClicks,
        currentMode,
        visualScore,
        verbalScore,
      ),
    onSuccess: () => {
      console.log("Refetching User Details");
      refetchUser();
      console.log("Refetched User Detail");
    },
    onError: (error) => {
      console.error("Error updating learning style:", error);
    },
  });

  return {
    updateLearningStyle,
    data,
    isLoading,
    error,
  };
}
