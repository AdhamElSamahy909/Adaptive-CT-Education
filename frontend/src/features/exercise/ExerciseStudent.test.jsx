import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ExerciseStudents from "./ExerciseStudents";

import useRunCode from "./useRunCode";
import useUser from "../authentication/useUser";
import useInferDifficulty from "../bayesianNetworks/useInferDifficulty";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import useDetectStruggle from "../struggle_detection/useDetectStruggle";
import useGetExercises from "./useGetExercises";
import useGetTopicName from "../../hooks/useGetTopicName";
import { MemoryRouter } from "react-router-dom";

vi.mock("./useRunCode");
vi.mock("../authentication/useUser");
vi.mock("../bayesianNetworks/useInferDifficulty");
vi.mock("../bayesianNetworks/useInferLearningStyle");
vi.mock("../struggle_detection/useDetectStruggle");
vi.mock("./useGetExercises");
vi.mock("../../hooks/useGetTopicName");

describe("ExerciseStudent Page", () => {
  let mockRunCode;
  let mockDetectStruggle;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRunCode = vi.fn();
    mockDetectStruggle = vi.fn();

    useRunCode.mockReturnValue({
      runCode: mockRunCode,
    });

    useUser.mockReturnValue({
      userId: "user_123",
      lastPref: "Unknown",
      refetchUser: vi.fn(),
      styleChange: { isDetected: false, isChanged: false },
    });

    useInferDifficulty.mockReturnValue({
      easyScore: 0.3,
      mediumScore: 0.4,
      hardScore: 0.3,
    });

    useInferLearningStyle.mockReturnValue({
      visualScore: 0.7,
      verbalScore: 0.3,
    });

    useDetectStruggle.mockReturnValue({
      detectStruggle: mockDetectStruggle,
    });

    useGetExercises.mockReturnValue({
      exercises: [],
    });

    useGetTopicName.mockReturnValue("loops");
  });

  it("student can navigate through exercises and submit code", async () => {
    useUser.mockReturnValue({
      userId: "user_123",
      solvedProblems: [],
      lastPref: "Unknown",
    });

    useInferDifficulty.mockReturnValue({
      easyScore: 0.3,
      mediumScore: 0.4,
      hardScore: 0.3,
      predictedDifficulty: "medium",
    });

    useGetExercises.mockReturnValue({
      exercises: [
        {
          _id: "problem_123",
          title: "Test Loop Problem",
          difficulty: "medium",
          starterCode: "for i in range(5):",
          testCases: [],
        },
      ],
      isLoading: false,
      error: null,
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ExerciseStudents />
      </MemoryRouter>,
    );

    const runButton = await screen.findByRole("button", { name: /Run Code/i });
    await user.click(runButton);

    expect(mockRunCode).toHaveBeenCalledTimes(1);
    expect(mockRunCode).toHaveBeenCalledWith(
      {
        code: "for i in range(5):",
        problemId: "problem_123",
        userId: "user_123",
        timeTaken: expect.any(Number),
        problemLevel: "medium",
        topic: "loops",
        easyScore: 0.3,
        mediumScore: 0.4,
        hardScore: 0.3,
        struggleDetected: false,
      },
      {
        onSuccess: expect.any(Function),
      },
    );
  });

  it("shows adaptive guide when struggling is detected", () => {
    vi.useFakeTimers();

    useDetectStruggle.mockReturnValue({
      detectStruggle: mockDetectStruggle,
      data: { struggling: true },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ExerciseStudents />
      </MemoryRouter>,
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/work through this together/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("shows success state", async () => {
    useRunCode.mockReturnValue({
      runCode: mockRunCode,
      isLoading: false,
      error: null,
      data: { success: true, results: [] },
      reset: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ExerciseStudents />
      </MemoryRouter>,
    );

    expect(await screen.findByText("✓ All Tests Passed")).toBeInTheDocument();
  });

  it("shows error state", async () => {
    useRunCode.mockReturnValue({
      runCode: mockRunCode,
      isLoading: false,
      error: null,
      data: { success: false, results: ["Test 1 failed"] },
      reset: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ExerciseStudents />
      </MemoryRouter>,
    );

    expect(await screen.findByText("✗ Some Tests Failed")).toBeInTheDocument();
  });
});
