import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

async function logoutApi() {
  // try {
  const { data } = await axiosInstance.post("/auth/logout");

  return data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || "Logout failed");
  // }
}

export default function useLogout() {
  const navigate = useNavigate();

  const {
    mutate: logout,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast.success("Logged out successfully");
      navigate("/login");
    },
    // onError: () => {
    //   toast.error("Logout failed");
    // },
  });

  return { logout, isLoading, error };
}
