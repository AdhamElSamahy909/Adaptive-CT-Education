import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

async function signupApi(
  firstName,
  lastName,
  email,
  password,
  passwordConfirm,
) {
  try {
    const { data } = await axiosInstance.post("/auth/signup", {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Signup failed");
  }
}

export default function useSignup() {
  const navigate = useNavigate();

  const {
    mutate: signup,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ firstName, lastName, email, password, passwordConfirm }) =>
      signupApi(firstName, lastName, email, password, passwordConfirm),
    onSuccess: () => {
      toast.success("Successful Signup");
      navigate("/");
    },
    onError: () => toast.error("Signup Failed"),
  });

  return { signup, isLoading, error };
}
