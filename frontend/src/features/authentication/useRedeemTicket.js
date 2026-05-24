import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

async function redeemTicketApi(ticket) {
  try {
    const { data } = await axiosInstance.post("/auth/redeem-ticket", {
      ticket,
    });

    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Redeem ticket failed");
  }
}

export default function useRedeemTicket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: redeemTicket,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ ticket }) => redeemTicketApi(ticket),
    retry: false,
    onSuccess: async () => {
      toast.success("Ticket redeemed successfully");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to redeem ticket");
    },
  });

  return {
    redeemTicket,
    isLoading,
    error,
    ticketRedeemed: !isLoading && !error,
  };
}
