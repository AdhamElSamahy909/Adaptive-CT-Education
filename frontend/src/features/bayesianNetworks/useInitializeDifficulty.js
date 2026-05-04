import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function initializeDifficultyApi(userId) {
  try {
    console.log("Initializing difficulty:", {
      userId,
    });

    const [loopsData, sequentialData, conditionalsData] = await Promise.all([
      axiosInstance.post("/bayesian-networks/difficulty/initialize", {
        userId,
        topic: "loops",
      }),
      axiosInstance.post("/bayesian-networks/difficulty/initialize", {
        userId,
        topic: "sequential",
      }),
      axiosInstance.post("/bayesian-networks/difficulty/initialize", {
        userId,
        topic: "conditionals",
      }),
    ]);

    console.log("Difficulty initialized successfully:", {
      loopsData: loopsData.data,
      sequentialData: sequentialData.data,
      conditionalsData: conditionalsData.data,
    });

    return { loopsData, sequentialData, conditionalsData };
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Initialize Difficulty Failed",
    );
  }
}

export default function useInitializeDifficulty() {
  const queryClient = useQueryClient();
  const {
    mutate: initializeDifficulty,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ userId }) => initializeDifficultyApi(userId),
    onSuccess: () => {
      toast.success("Difficulty Initialized Successfully!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: () => {
      toast.error("Initialize Difficulty Failed");
    },
  });

  return { initializeDifficulty, isLoading, error };
}
