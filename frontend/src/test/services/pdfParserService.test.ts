import { describe, it, expect, vi, beforeEach } from "vitest";
import { PDFParserService } from "../../services/pdfParserService";

describe("PDFParserService", () => {
  let service: PDFParserService;

  beforeEach(() => {
    service = PDFParserService.getInstance();
  });

  describe("File Validation", () => {
    it("should validate PDF files correctly", () => {
      const pdfFile = new File(["test"], "test.pdf", {
        type: "application/pdf",
      });
      const nonPdfFile = new File(["test"], "test.txt", { type: "text/plain" });

      expect(PDFParserService.isPDF(pdfFile)).toBe(true);
      expect(PDFParserService.isPDF(nonPdfFile)).toBe(false);
    });

    it("should validate file size correctly", () => {
      const smallFile = new File(["test"], "test.pdf", {
        type: "application/pdf",
      });
      const largeFile = new File(
        [new ArrayBuffer(11 * 1024 * 1024)],
        "large.pdf",
        { type: "application/pdf" }
      );

      expect(PDFParserService.validateFileSize(smallFile)).toBe(true);
      expect(PDFParserService.validateFileSize(largeFile)).toBe(false);
    });

    it("should calculate file size in MB correctly", () => {
      const file = new File([new ArrayBuffer(5 * 1024 * 1024)], "test.pdf", {
        type: "application/pdf",
      });
      expect(PDFParserService.getFileSizeMB(file)).toBe(5);
    });
  });

  describe("Text Parsing", () => {
    it("should extract skills from resume text", async () => {
      const mockFile = new File(
        ["John Doe\nJavaScript React Node.js\nPython Django"],
        "test.pdf",
        { type: "application/pdf" }
      );

      const result = await service.parseResume(mockFile);

      expect(result.skills).toContain("JavaScript");
      expect(result.skills).toContain("React");
      expect(result.skills).toContain("Node.js");
      expect(result.skills).toContain("Python");
      expect(result.skills).toContain("Django");
    });

    it("should extract personal information", async () => {
      const mockFile = new File(
        ["John Doe\njohn.doe@email.com\n(555) 123-4567\nNew York, NY"],
        "test.pdf",
        { type: "application/pdf" }
      );

      const result = await service.parseResume(mockFile);

      expect(result.personalInfo.name).toBe("John Doe");
      expect(result.personalInfo.email).toBe("john.doe@email.com");
      expect(result.personalInfo.phone).toBe("(555) 123-4567");
      expect(result.personalInfo.location).toBe("New York, NY");
    });

    it("should extract experience information", async () => {
      const mockFile = new File(
        [
          "Experience\n",
          "Tech Company Inc. - Senior Developer\n",
          "2020-2023\n",
          "Developed web applications using React and Node.js\n",
          "Another Company - Junior Developer\n",
          "2018-2020\n",
          "Worked on frontend development",
        ],
        "test.pdf",
        { type: "application/pdf" }
      );

      const result = await service.parseResume(mockFile);

      expect(result.experience).toHaveLength(2);
      expect(result.experience[0].company).toBe("Tech Company Inc.");
      expect(result.experience[0].position).toBe("Senior Developer");
      expect(result.experience[1].company).toBe("Another Company");
      expect(result.experience[1].position).toBe("Junior Developer");
    });

    it("should extract education information", async () => {
      const mockFile = new File(
        [
          "Education\n",
          "University of Technology - Bachelor of Science - Computer Science\n",
          "2014-2018\n",
          "Master of Science - Software Engineering\n",
          "2018-2020",
        ],
        "test.pdf",
        { type: "application/pdf" }
      );

      const result = await service.parseResume(mockFile);

      expect(result.education).toHaveLength(2);
      expect(result.education[0].institution).toBe("University of Technology");
      expect(result.education[0].degree).toBe("Bachelor of Science");
      expect(result.education[0].field).toBe("Computer Science");
    });

    it("should extract summary section", async () => {
      const mockFile = new File(
        [
          "Summary\n",
          "Experienced software developer with 5+ years of experience\n",
          "in web development using modern technologies\n",
          "Experience\n",
          "Previous work experience...",
        ],
        "test.pdf",
        { type: "application/pdf" }
      );

      const result = await service.parseResume(mockFile);

      expect(result.summary).toContain("Experienced software developer");
      expect(result.summary).toContain("5+ years of experience");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid PDF files gracefully", async () => {
      const invalidFile = new File(["invalid content"], "test.pdf", {
        type: "application/pdf",
      });

      await expect(service.parseResume(invalidFile)).rejects.toThrow(
        "Failed to parse PDF file"
      );
    });

    it("should return empty arrays for missing sections", async () => {
      const mockFile = new File(["Just some random text"], "test.pdf", {
        type: "application/pdf",
      });

      const result = await service.parseResume(mockFile);

      expect(result.skills).toEqual([]);
      expect(result.experience).toEqual([]);
      expect(result.education).toEqual([]);
      expect(result.summary).toBeUndefined();
    });
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = PDFParserService.getInstance();
      const instance2 = PDFParserService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
