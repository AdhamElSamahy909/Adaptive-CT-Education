import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function detectStruggleApi(
  userId,
  exerciseId,
  attemptNum,
  timeDelta,
  testProgress,
  difficulty,
) {
  try {
    console.log("Detecting struggle for user: ", userId, " with data: ", {
      exerciseId,
      attemptNum,
      timeDelta,
      testProgress,
      difficulty,
    });
    const { data } = await axiosInstance.post("/exercises/detect-struggling", {
      userId,
      attemptNum,
      timeDelta,
      testProgress,
      difficulty,
      exerciseId,
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
      exerciseId,
      attemptNum,
      timeDelta,
      testProgress,
      difficulty,
    }) =>
      detectStruggleApi(
        userId,
        exerciseId,
        attemptNum,
        timeDelta,
        testProgress,
        difficulty,
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
