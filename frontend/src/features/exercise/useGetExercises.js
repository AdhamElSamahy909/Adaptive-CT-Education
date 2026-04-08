import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function getExercisesApi() {
  try {
    const { data } = await axiosInstance.get("/exercises");
    return data.exercises || [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch exercises",
    );
  }
}

export default function useGetExercises() {
  const {
    data: exercises = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercisesApi,
  });

  return { exercises, isLoading, error, refetch };
}
