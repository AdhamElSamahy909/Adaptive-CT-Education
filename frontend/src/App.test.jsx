import { render } from "@testing-library/react";
import App from "./App";
import { expect } from "vitest";

describe("Frontend Sanity Check", () => {
  it("renders without crashing", () => {
    render(<App />);
  });

  it("proves the test suite is running", () => {
    expect(1 + 2).toBe(3);
  });
});
