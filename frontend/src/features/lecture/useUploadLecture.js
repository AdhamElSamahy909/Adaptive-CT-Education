import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

async function uploadLectureApi(type, topic, file) {
  try {
    await axiosInstance.delete("/lectures", {
      params: { type, topic },
    });

    const formData = new FormData();
    formData.append("type", type);
    formData.append("topic", topic);
    formData.append("pdf_file", file);

    const { data } = await axiosInstance.post("/lectures", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Upload failed");
  }
}

export default function useUploadLecture() {
  const {
    data,
    mutate: uploadLecture,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: ({ type, topic, file }) => uploadLectureApi(type, topic, file),
    onSuccess: () => {
      toast.success("Lecture uploaded successfully");
    },
    onError: () => {
      toast.error("Lecture upload failed");
    },
  });

  return { uploadLecture, isLoading, error, urlUploaded: data?.url, reset };
}
