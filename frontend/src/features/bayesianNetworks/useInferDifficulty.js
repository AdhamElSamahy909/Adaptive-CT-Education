import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function inferDifficultyApi(userId) {
  try {
    console.log("Inferring difficulty level for user:", userId);
    const { data } = await axiosInstance.get(
      `/bayesian-networks/difficulty/infer/${userId}`,
    );

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to infer difficulty level",
    );
  }
}

export default function useInferDifficulty(userId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["difficulty", userId],
    queryFn: () => inferDifficultyApi(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    easyScore: data?.Easy,
    mediumScore: data?.Medium,
    hardScore: data?.Hard,
    predictedDifficulty: data?.predicted_difficulty,
    isLoading,
    error,
    refetch,
  };
}
