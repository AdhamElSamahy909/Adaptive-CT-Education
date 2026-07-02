import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import toast from "react-hot-toast";

const handleGlobalError = (error) => {
  console.log("Global Error Caught:", error);

  const status = error?.response?.status;
  const data = error?.response?.data;

  console.log("Parsed Status:", status);
  console.log("Parsed Data:", data?.message);

  // Check if it's our specific 400 rejection
  if (status === 400 && data?.success === false) {
    console.log("Handling specific 400 error with detectedFields");
    // 1. Check if the server returned specific detected fields
    if (data?.detectedFields) {
      console.log("Entered detectedFields block");
      // 2. Recursive function to handle nested objects
      const triggerFieldToasts = (fields, parentKey = "") => {
        for (const [key, value] of Object.entries(fields)) {
          // Construct the dot-notation path (e.g., "preferences.signature")
          const fieldPath = parentKey ? `${parentKey}.${key}` : key;

          if (typeof value === "object" && value !== null) {
            // If it's a nested object, recurse deeper
            triggerFieldToasts(value, fieldPath);
          } else {
            // UPDATE: Trigger the toast with the field name AND the offending value
            toast.error(`${value}`);
          }
        }
      };

      // 3. Execute the recursive function
      triggerFieldToasts(data.detectedFields);
    } else {
      console.log("Data: ", data);
      // Fallback just in case a generic 400 error occurs without detectedFields
      toast.error(data?.message || "Request failed due to bad input.");
    }
  } else {
    toast.error(data?.message || "An unexpected error occurred.");
  }
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalError,
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalError,
  }),
});
