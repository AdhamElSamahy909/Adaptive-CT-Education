import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function updateExerciseApi(exerciseId, exerciseData) {
  try {
    const { data } = await axiosInstance.patch(
      `/exercises/${exerciseId}`,
      exerciseData,
    );
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to update exercise",
    );
  }
}

export default function useUpdateExercise() {
  const queryClient = useQueryClient();

  const {
    mutate: updateExercise,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ exerciseId, exerciseData }) =>
      updateExerciseApi(exerciseId, exerciseData),
    onSuccess: () => {
      toast.success("Exercise updated successfully");
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
    onError: () => {
      toast.error("Failed to update exercise");
    },
  });

  return { updateExercise, isLoading, error };
}
