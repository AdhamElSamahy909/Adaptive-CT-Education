import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function updateLearningStyleApi(userId, numOfBackClicks, currentMode) {
  try {
    console.log("Updating learning style for user: ", userId);
    const { data } = await axiosInstance.post(
      `bayesian-networks/learning-style/update/${userId}`,
      {
        userId,
        numOfBackClicks,
        currentMode,
      },
    );

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to update learning style",
    );
  }
}

export default function useUpdateLearningStyle() {
  const {
    mutate: updateLearningStyle,
    data,
    isLoading,
    error,
  } = useMutation({
    mutationFn: ({ userId, numOfBackClicks, currentMode }) =>
      updateLearningStyleApi(userId, numOfBackClicks, currentMode),
  });

  return {
    updateLearningStyle,
    data,
    isLoading,
    error,
  };
}
