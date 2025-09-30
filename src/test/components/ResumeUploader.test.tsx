import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResumeUploader } from "../../components/resume/ResumeUploader";

// Mock the resume store
vi.mock("../../store/resumeStore", () => ({
  useResumeStore: () => ({
    uploadResume: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock the PDF parser service
vi.mock("../../services/pdfParserService", () => ({
  PDFParserService: {
    isPDF: vi.fn((file) => file.type === "application/pdf"),
    validateFileSize: vi.fn((file) => file.size <= 10 * 1024 * 1024),
    getFileSizeMB: vi.fn((file) => file.size / (1024 * 1024)),
  },
  pdfParserService: {
    parseResume: vi.fn(() =>
      Promise.resolve({
        skills: ["JavaScript", "React"],
        experience: [],
        education: [],
        summary: "Test summary",
        personalInfo: {
          name: "John Doe",
          email: "john@example.com",
        },
        rawText: "Test content",
      })
    ),
  },
}));

describe("ResumeUploader", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render upload area correctly", () => {
    render(<ResumeUploader />);

    expect(screen.getByText("Upload Your Resume")).toBeInTheDocument();
    expect(
      screen.getByText("Drag & drop your resume here, or click to browse")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Supports PDF files (Max 10MB)")
    ).toBeInTheDocument();
  });

  it("should handle file drop correctly", async () => {
    const { useResumeStore } = await import("../../store/resumeStore");
    const mockUploadResume = vi.fn();
    vi.mocked(useResumeStore).mockReturnValue({
      uploadResume: mockUploadResume,
      isLoading: false,
      error: null,
    });

    render(<ResumeUploader />);

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, file);

    await waitFor(() => {
      expect(mockUploadResume).toHaveBeenCalledWith(file, expect.any(Object));
    });
  });

  it("should show parsing status during upload", async () => {
    const { pdfParserService } = await import(
      "../../services/pdfParserService"
    );
    vi.mocked(pdfParserService.parseResume).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                skills: ["JavaScript"],
                experience: [],
                education: [],
                summary: "Test",
                personalInfo: {},
                rawText: "Test",
              }),
            100
          )
        )
    );

    render(<ResumeUploader />);

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, file);

    expect(screen.getByText("Parsing resume content...")).toBeInTheDocument();
  });

  it("should show success message after successful upload", async () => {
    render(<ResumeUploader />);

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, file);

    await waitFor(() => {
      expect(
        screen.getByText("Resume parsed and uploaded successfully!")
      ).toBeInTheDocument();
    });
  });

  it("should show error for non-PDF files", async () => {
    render(<ResumeUploader />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText("Please upload a PDF file")).toBeInTheDocument();
    });
  });

  it("should show error for files that are too large", async () => {
    const { PDFParserService } = await import(
      "../../services/pdfParserService"
    );
    vi.mocked(PDFParserService.validateFileSize).mockReturnValue(false);

    render(<ResumeUploader />);

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, file);

    await waitFor(() => {
      expect(
        screen.getByText("File size must be less than 10MB")
      ).toBeInTheDocument();
    });
  });

  it("should show error when parsing fails", async () => {
    const { pdfParserService } = await import(
      "../../services/pdfParserService"
    );
    vi.mocked(pdfParserService.parseResume).mockRejectedValue(
      new Error("Parsing failed")
    );

    render(<ResumeUploader />);

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText("Failed to parse resume")).toBeInTheDocument();
    });
  });

  it("should show store error when upload fails", async () => {
    const { useResumeStore } = await import("../../store/resumeStore");
    vi.mocked(useResumeStore).mockReturnValue({
      uploadResume: vi.fn(),
      isLoading: false,
      error: "Upload failed",
    });

    render(<ResumeUploader />);

    expect(screen.getByText("Upload failed")).toBeInTheDocument();
  });

  it("should show loading state", async () => {
    const { useResumeStore } = await import("../../store/resumeStore");
    vi.mocked(useResumeStore).mockReturnValue({
      uploadResume: vi.fn(),
      isLoading: true,
      error: null,
    });

    render(<ResumeUploader />);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
