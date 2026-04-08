import { useLocation } from "react-router-dom";

export default function useGetTopicName() {
  return useLocation()
    .pathname.replaceAll("/", "")
    .replace("lecture", "")
    .replace("exercise", "");
}
