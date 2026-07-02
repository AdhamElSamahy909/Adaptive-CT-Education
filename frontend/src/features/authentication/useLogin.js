import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

async function loginApi(email, password) {
  // try {
  const { data } = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return data;
  // } catch (error) {
  //   console.log("Login error:", error);
  //   throw new Error(error?.response?.data?.message || "Login failed");
  // }
}

export default function useLogin() {
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi(email, password),
    onSuccess: () => {
      toast.success("Successful Login");
      navigate("/");
    },
    // onError: () => {
    //   toast.error("Login Failed");
    // },
  });

  return { login, isLoading, error };
}
