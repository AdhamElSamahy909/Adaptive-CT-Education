import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";

async function getLectureApi(type, topic) {
  // try {
  const { data } = await axiosInstance.get("/lectures", {
    params: { type, topic },
  });

  return data;
  // } catch (error) {
  //   throw new Error(
  //     error?.response?.data?.message || "Failed to fetch lecture",
  //   );
  // }
}

export default function useGetLecture(type, topic) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lecture", type, topic],
    queryFn: () => getLectureApi(type, topic),
    enabled: Boolean(type && topic),
  });

  return { url: data?.url, isLoading, error };
}
