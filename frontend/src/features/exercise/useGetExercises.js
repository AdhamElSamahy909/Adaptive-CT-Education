import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function getExercisesApi(topic) {
  // try {
  const { data } = await axiosInstance.get(`/exercises/topic/${topic}`);
  return data.exercises || [];
  // } catch (error) {
  //   throw new Error(
  //     error?.response?.data?.message || "Failed to fetch exercises",
  //   );
  // }
}

export default function useGetExercises(topic) {
  const {
    data: exercises = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exercises", topic],
    queryFn: () => getExercisesApi(topic),
    enabled: !!topic,
  });

  return { exercises, isLoading, error, refetch };
}
