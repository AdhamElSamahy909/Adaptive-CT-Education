import axiosInstance from "../../lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

async function verifyJWT() {
  try {
    // console.log("Fetching User Details");
    const { data } = await axiosInstance.get("/auth/verifyJWT");

    // console.log("User Details: ", data);

    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Authentication failed");
  }
}

export default function useUser() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user"],
    // retry: false,
    queryFn: verifyJWT,
  });

  return {
    coldStartChallengeFixed: data?.coldStartChallengeCompleted,
    lastPref: data?.lastPreferredLearningStyle,
    isLoading,
    isAuthenticated: !!data && !error,
    userId: data?.id,
    refetchUser: refetch,
    solvedProblems: data?.solvedProblems,
    role: data?.role,
    styleChange: data?.styleChange,
  };
}
