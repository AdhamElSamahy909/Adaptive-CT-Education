import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosInstance from "../lib/axiosInstance";
import Signup from "./Signup";

vi.mock("../lib/axiosInstance", () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const renderWithProviders = (ui) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits the form and calls the API with correct credentials", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: { success: true, token: "fake-jwt-token" },
    });

    renderWithProviders(<Signup />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/John/i), "First");
    await user.type(screen.getByPlaceholderText(/Doe/i), "Last");
    await user.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "test@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Enter your password/i),
      "securepass",
    );
    await user.type(
      screen.getByPlaceholderText(/Confirm your password/i),
      "securepass",
    );
    await user.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/auth/signup", {
        firstName: "First",
        lastName: "Last",
        email: "test@example.com",
        password: "securepass",
        passwordConfirm: "securepass",
      });
    });
  });
});
