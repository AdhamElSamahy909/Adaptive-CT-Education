import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function deleteExerciseApi(exerciseId) {
  try {
    const { data } = await axiosInstance.delete(`/exercises/${exerciseId}`);
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete exercise",
    );
  }
}

export default function useDeleteExercise() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteExercise,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: deleteExerciseApi,
    onSuccess: () => {
      toast.success("Exercise deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
    onError: () => {
      toast.error("Failed to delete exercise");
    },
  });

  return { deleteExercise, isLoading, error };
}
