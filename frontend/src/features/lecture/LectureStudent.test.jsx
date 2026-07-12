import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LectureStudent from "./LectureStudent";

import useUser from "../authentication/useUser";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import useUpdateLearningStyle from "../bayesianNetworks/useUpdateLearningStyle";
import useGetLecture from "./useGetLecture";
import useGetTopicName from "../../hooks/useGetTopicName";
import useChangeIsStyleChanged from "../bayesianNetworks/useChangeIsStyleChanged";

vi.mock("../authentication/useUser");
vi.mock("../bayesianNetworks/useInferLearningStyle");
vi.mock("../bayesianNetworks/useUpdateLearningStyle");
vi.mock("./useGetLecture");
vi.mock("../../hooks/useGetTopicName");
vi.mock("../bayesianNetworks/useChangeIsStyleChanged");

vi.mock("react-pdf", () => {
  return {
    pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
    Page: () => <div data-testid="mocked-pdf-page">Mocked PDF Page</div>,
    Document: ({ children, onLoadSuccess }) => {
      setTimeout(() => onLoadSuccess({ numPages: 5 }), 0);
      return <div data-testid="mocked-pdf-document">{children}</div>;
    },
  };
});

describe("LectureStudent Page", () => {
  let mockUpdateLearningStyle;
  let mockSubmitChangeIsStyleChanged;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdateLearningStyle = vi.fn();
    mockSubmitChangeIsStyleChanged = vi.fn();

    useUser.mockReturnValue({
      userId: "user_123",
      lastPref: "Unknown",
      refetchUser: vi.fn(),
      styleChange: { isDetected: false, isChanged: false },
    });

    useInferLearningStyle.mockReturnValue({
      visualScore: 0.7,
      verbalScore: 0.3,
    });

    useUpdateLearningStyle.mockReturnValue({
      updateLearningStyle: mockUpdateLearningStyle,
    });

    useGetLecture.mockReturnValue({
      url: "fake-lecture.pdf",
      isLoading: false,
    });

    useGetTopicName.mockReturnValue("loops");

    useChangeIsStyleChanged.mockReturnValue({
      submitChangeIsStyleChanged: mockSubmitChangeIsStyleChanged,
    });
  });

  it("renders the loading state correctly", () => {
    useGetLecture.mockReturnValue({ url: null, isLoading: true });
    render(<LectureStudent />);
    expect(screen.getByText(/Loading Lecture Slides.../i)).toBeInTheDocument();
  });

  it("shows the Style Change Modal when logic (XOR) is met", () => {
    useUser.mockReturnValue({
      userId: "user_123",
      lastPref: "Visual",
      refetchUser: vi.fn(),
      styleChange: { isDetected: true, isChanged: false },
    });

    render(<LectureStudent />);
    expect(screen.getByText(/Learning Style Updated!/i)).toBeInTheDocument();
  });

  it("calculates telemetry and updates learning style after 4 forward clicks", async () => {
    const user = userEvent.setup();
    render(<LectureStudent />);

    const nextButton = await screen.findByRole("button", {
      name: /Next Slide/i,
    });

    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);

    expect(mockUpdateLearningStyle).toHaveBeenCalledTimes(1);
    expect(mockUpdateLearningStyle).toHaveBeenCalledWith({
      userId: "user_123",
      numOfBackClicks: 0,
      numOfForwardClicks: 4,
      currentMode: "Visual",
      visualScore: 0.7,
      verbalScore: 0.3,
    });
  });
});
