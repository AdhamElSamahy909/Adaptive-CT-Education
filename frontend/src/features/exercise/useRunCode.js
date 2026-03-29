import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function runCodeApi(code, problemId, userId, timeTaken, problemLevel) {
  try {
    console.log("Running code:", code);
    const { data } = await axiosInstance.post("/execute", {
      code,
      problemId,
      userId,
      timeTaken,
      problemLevel,
    });

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to execute code",
    );
  }
}

export default function useRunCode(refetchDifficulty) {
  const {
    mutate: runCode,
    isPending: isLoading,
    error,
    data,
    status,
  } = useMutation({
    mutationFn: ({ code, problemId, userId, timeTaken, problemLevel }) =>
      runCodeApi(code, problemId, userId, timeTaken, problemLevel),
    onSuccess: (data) => {
      toast.success("Code executed successfully");
      console.log("Result of successfully running code: ", data);
      refetchDifficulty();
    },
    onError: (error) => {
      toast.error(error.message || "Code execution failed");
    },
  });

  return { runCode, isLoading, error, data, status };
}
