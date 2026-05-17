import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function changeIsStyleChangedApi(userId) {
  try {
    console.log("Submitting learning style change:", {
      userId,
    });

    const { data } = await axiosInstance.post(
      `bayesian-networks/learning-style/set-is-changed/${userId}`,
    );

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Learning Style Change Failed",
    );
  }
}

export default function useChangeIsStyleChanged() {
  const queryClient = useQueryClient();
  const {
    mutate: submitChangeIsStyleChanged,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ userId }) => changeIsStyleChangedApi(userId),
    onSuccess: () => {
      // toast.success("Learning Style Updated!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: () => {
      toast.error("Learning Style Update Failed");
    },
  });

  return { submitChangeIsStyleChanged, isLoading, error };
}
