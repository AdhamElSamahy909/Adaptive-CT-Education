import axiosInstance from "../../lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

async function verifyJWT() {
  try {
    const { data } = await axiosInstance.get("/auth/verifyJWT");

    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Authentication failed");
  }
}

export default function useUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: verifyJWT,
  });

  return {
    coldStartChallengeFixed: data?.coldStartChallengeCompleted,
    lastPref: data?.lastPreferredLearningStyle,
    isLoading,
    isAuthenticated: !error,
    userId: data?.id,
  };
}
