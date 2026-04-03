import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function detectStruggleApi(
  userId,
  attemptNum,
  timeDelta,
  testProgress,
  errorType,
  codeLenChange,
  codeLenPrev,
  similarityToSolution,
  consecutiveSameError,
) {
  try {
    console.log("Detecting struggle for user: ", userId);
    const { data } = await axiosInstance.post("/detect-struggling", {
      userId,
      attempt_num: attemptNum,
      time_delta: timeDelta,
      test_progress: testProgress,
      error_type: errorType,
      code_len_change: codeLenChange,
      code_len_prev: codeLenPrev,
      similarity_to_solution: similarityToSolution,
      consecutive_same_error: consecutiveSameError,
    });

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to detect struggle",
    );
  }
}

export default function useDetectStruggle() {
  const {
    mutate: detectStruggle,
    data,
    isLoading,
    error,
  } = useMutation({
    mutationFn: ({
      userId,
      attemptNum,
      timeDelta,
      testProgress,
      errorType,
      codeLenChange,
      codeLenPrev,
      similarityToSolution,
      consecutiveSameError,
    }) =>
      detectStruggleApi(
        userId,
        attemptNum,
        timeDelta,
        testProgress,
        errorType,
        codeLenChange,
        codeLenPrev,
        similarityToSolution,
        consecutiveSameError,
      ),
    onError: (error) => {
      console.error("Error detecting struggle:", error);
    },
  });

  return {
    detectStruggle,
    data,
    isLoading,
    error,
  };
}
