import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function inferLearningStyleApi(userId) {
  // try {
  // console.log("Inferring learning style for user:", userId);
  const { data } = await axiosInstance.get(
    `bayesian-networks/learning-style/infer/${userId}`,
  );

  return data;
  // } catch (error) {
  //   throw new Error(
  //     error?.response?.data?.message || "Failed to infer learning style",
  //   );
  // }
}

export default function useInferLearningStyle(userId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["learningStyle", userId],
    queryFn: () => inferLearningStyleApi(userId),
    enabled: !!userId,
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    visualScore: data?.Visual,
    verbalScore: data?.Verbal,
    isLoading,
    error,
    refetch,
  };
}
