import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function createExercisesApi(exercises) {
  console.log("Creating exercises with data: ", exercises);
  try {
    const { data } = await axiosInstance.post("/exercises", {
      exercises: exercises,
    });

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to create exercise",
    );
  }
}

export default function useCreateExercises() {
  const queryClient = useQueryClient();
  const {
    mutate: createExercises,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ exercises }) => createExercisesApi(exercises),
    onSuccess: () => {
      toast.success("Exercise(s) created successfully");

      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
    onError: () => {
      toast.error("Failed to create exercises");
    },
  });

  return { createExercises, isLoading, error };
}
