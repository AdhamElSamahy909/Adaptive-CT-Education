import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function getAllExercisesApi() {
  try {
    const { data } = await axiosInstance.get("/exercises");
    return data.exercises || [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch exercises",
    );
  }
}

export default function useGetAllExercises() {
  const {
    data: exercises = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: getAllExercisesApi,
  });

  return { exercises, isLoading, error, refetch };
}
