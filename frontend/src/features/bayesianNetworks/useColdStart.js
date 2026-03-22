import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function coldStartApi(userId, challenge1Answer, challenge2Answer) {
  try {
    console.log("Submitting cold start challenge results:", {
      userId,
      challenge1Answer,
      challenge2Answer,
    });
    const { data } = await axiosInstance.post(
      "bayesian-networks/learning-style/cold-start",
      {
        userId,
        challenge1Answer,
        challenge2Answer,
      },
    );

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Cold Start Challenge Failed",
    );
  }
}

export default function useColdStart() {
  const {
    mutate: submitColdStart,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ userId, challenge1Answer, challenge2Answer }) =>
      coldStartApi(userId, challenge1Answer, challenge2Answer),
    onSuccess: () => {
      toast.success("Cold Start Challenge Completed!");
    },
    onError: () => {
      toast.error("Cold Start Challenge Failed");
    },
  });

  return { submitColdStart, isLoading, error };
}
