import { GoogleGenerativeAI } from "@google/generative-ai";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function createGuideApi(title, description, testCases, topic) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const stepsPrompt = `Generate a simple step-by-step guide, with no details, to solve the following coding problem using ${topic.toLowerCase()}:\n\nTitle: ${title}\n\nDescription: ${description}\n\nTest Cases:\n${testCases}`;
    // const flowChartPrompt = `
    //   Task: Generate a logic flowchart to solve a coding problem.
    //   Topic: ${topic}
    //   Problem Title: ${title}
    //   Description: ${description}
    //   Test Cases: ${testCases}

    //   Output Requirements:
    //   Return ONLY a JSON array. Each object in the array must follow this structure:
    //   {
    //     "text": "A concise description of the step",
    //     "shape": "Choose one: oval, rectangle, parallelogram, or diamond",
    //     "directedTowards": [
    //       {
    //         "direction": "Choose one: next, yes, or no",
    //         "requiredStep": "Must EXACTLY match the 'text' field of the target step"
    //       }
    //     ]
    //   }

    //   Logic Rules:
    //   1. 'oval' is for Start/End.
    //   2. 'diamond' is for Decision points (using 'yes' or 'no' directions).
    //   3. 'parallelogram' is for Input/Output.
    //   4. 'rectangle' is for Process/Calculation.
    //   5. Ensure 'requiredStep' matches an existing 'text' value in your list to maintain graph integrity.
    // `;

    // console.log("Sending flowchart prompt to Gemini API: ", flowChartPrompt);

    console.log("Sending steps prompt to Gemini API: ", stepsPrompt);

    // const [flowChartResult, stepsResult] = await Promise.all([
    //   model.generateContent(flowChartPrompt),
    //   model.generateContent(stepsPrompt),
    // ]);
    const stepsResult = await model.generateContent(stepsPrompt);

    // const flowChartResponse = await flowChartResult.response;
    // const flowChartText = flowChartResponse.text();
    // const cleanJson = flowChartText.replace(/```json|```/g, "").trim();

    const stepsResponse = await stepsResult.response;
    const stepsText = stepsResponse.text();

    return { steps: stepsText, flowchart: [] };
  } catch (error) {
    console.error(error);
    throw new Error(error?.message || "Generating guide failed");
  }
}

export default function useCreateGuide() {
  const {
    data,
    mutate: createGuide,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ title, description, testCases, topic }) =>
      createGuideApi(title, description, testCases, topic),
    onSuccess: (data) => {
      toast.success("Guide generated successfully");
      console.log("Generated steps guide: ", data.steps);
      console.log("Generated flowchart: ", data.flowchart);
    },
    onError: (err) => toast.error(err.message),
  });

  return { data, createGuide, isLoading, error };
}
