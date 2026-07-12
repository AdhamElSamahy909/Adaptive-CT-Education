// frontend/src/setupTests.js
import "@testing-library/jest-dom";
import { vi } from "vitest";

// 1. Mock react-pdf to prevent JSDOM from crashing on pdf.js Canvas APIs
vi.mock("react-pdf", () => {
  return {
    // Mock the pdfjs object to prevent worker errors
    pdfjs: {
      GlobalWorkerOptions: { workerSrc: "" },
    },
    // Mock the Document component to just render its children
    Document: ({ children }) => {
      children;
    },
    // Mock the Page component to render a simple placeholder
    Page: () => "[PDF Page Rendered in UI]",
  };
});

// (Optional) If you also use the standard HTML canvas API anywhere else,
// this is a handy global polyfill to prevent future JSDOM crashes:
global.DOMMatrix = class DOMMatrix {
  constructor() {}
};
