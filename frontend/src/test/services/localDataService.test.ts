import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocalDataService } from "../../services/localDataService";

// Mock the StorageService
vi.mock("../../services/storageService", () => ({
  StorageService: {
    saveUser: vi.fn(),
    getUserByEmail: vi.fn(),
    updateUser: vi.fn(),
    saveResume: vi.fn(),
    getResumes: vi.fn(),
    saveInterview: vi.fn(),
    getInterviews: vi.fn(),
    saveCareerPaths: vi.fn(),
    getCareerPaths: vi.fn(),
    saveResources: vi.fn(),
    getResourcesByCategory: vi.fn(),
  },
}));

describe("LocalDataService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should login user successfully", async () => {
      const mockUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "",
        createdAt: "2023-01-01",
        lastLogin: "2023-01-01",
      };

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getUserByEmail).mockResolvedValue(mockUser);
      vi.mocked(StorageService.updateUser).mockResolvedValue();

      const result = await LocalDataService.login(
        "john@example.com",
        "password"
      );

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
      expect(StorageService.getUserByEmail).toHaveBeenCalledWith(
        "john@example.com"
      );
    });

    it("should throw error for non-existent user", async () => {
      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getUserByEmail).mockResolvedValue(null);

      await expect(
        LocalDataService.login("nonexistent@example.com", "password")
      ).rejects.toThrow("User not found");
    });

    it("should register new user", async () => {
      const mockUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "",
        createdAt: "2023-01-01",
        lastLogin: "2023-01-01",
      };

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getUserByEmail).mockResolvedValue(null);
      vi.mocked(StorageService.saveUser).mockResolvedValue();

      const result = await LocalDataService.register(
        "John Doe",
        "john@example.com",
        "password"
      );

      expect(result.user).toEqual(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
        })
      );
      expect(result.token).toBeDefined();
    });

    it("should throw error for existing user during registration", async () => {
      const mockUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "",
        createdAt: "2023-01-01",
        lastLogin: "2023-01-01",
      };

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getUserByEmail).mockResolvedValue(mockUser);

      await expect(
        LocalDataService.register("John Doe", "john@example.com", "password")
      ).rejects.toThrow("User already exists");
    });
  });

  describe("Resume Management", () => {
    it("should upload resume successfully", async () => {
      const mockFile = new File(["test content"], "resume.pdf", {
        type: "application/pdf",
      });
      const mockResume = {
        id: "resume-1",
        userId: "user-1",
        fileName: "resume.pdf",
        uploadDate: "2023-01-01",
        fileSize: 1000,
        fileType: "application/pdf",
        parsedData: {
          skills: ["JavaScript", "React"],
          experience: [],
          education: [],
          summary: "Test summary",
          extractedText: "Test content",
        },
      };

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.saveResume).mockResolvedValue();

      const result = await LocalDataService.uploadResume("user-1", mockFile);

      expect(result.fileName).toBe("resume.pdf");
      expect(result.userId).toBe("user-1");
      expect(StorageService.saveResume).toHaveBeenCalled();
    });

    it("should get resumes for user", async () => {
      const mockResumes = [
        {
          id: "resume-1",
          userId: "user-1",
          fileName: "resume1.pdf",
          uploadDate: "2023-01-01",
          fileSize: 1000,
          fileType: "application/pdf",
          parsedData: {
            skills: ["JavaScript"],
            experience: [],
            education: [],
            summary: "Test",
            extractedText: "Test",
          },
        },
      ];

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getResumes).mockResolvedValue(mockResumes);

      const result = await LocalDataService.getResumes("user-1");

      expect(result).toEqual(mockResumes);
      expect(StorageService.getResumes).toHaveBeenCalledWith("user-1");
    });
  });

  describe("Interview Management", () => {
    it("should start interview session", async () => {
      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.saveInterview).mockResolvedValue();

      const result = await LocalDataService.startInterview(
        "user-1",
        "Software Engineer"
      );

      expect(result.userId).toBe("user-1");
      expect(result.jobTitle).toBe("Software Engineer");
      expect(result.startTime).toBeDefined();
      expect(StorageService.saveInterview).toHaveBeenCalled();
    });

    it("should end interview session", async () => {
      const mockInterview = {
        id: "interview-1",
        userId: "user-1",
        startTime: "2023-01-01T10:00:00Z",
        endTime: "2023-01-01T11:00:00Z",
        jobTitle: "Software Engineer",
        feedback: undefined,
        metrics: undefined,
      };

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getInterviews).mockResolvedValue([
        mockInterview,
      ]);

      const result = await LocalDataService.endInterview("interview-1");

      expect(result.endTime).toBeDefined();
    });

    it("should get interviews for user", async () => {
      const mockInterviews = [
        {
          id: "interview-1",
          userId: "user-1",
          startTime: "2023-01-01T10:00:00Z",
          endTime: "2023-01-01T11:00:00Z",
          jobTitle: "Software Engineer",
          feedback: undefined,
          metrics: undefined,
        },
      ];

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getInterviews).mockResolvedValue(mockInterviews);

      const result = await LocalDataService.getInterviews("user-1");

      expect(result).toEqual(mockInterviews);
      expect(StorageService.getInterviews).toHaveBeenCalledWith("user-1");
    });
  });

  describe("Career and Resources", () => {
    it("should get career paths", async () => {
      const mockCareerPaths = [
        {
          id: "path-1",
          title: "Software Developer",
          description: "Build applications",
          requiredSkills: ["JavaScript", "React"],
          growthRate: 15,
          averageSalary: "$80,000",
          recommendedResources: [],
        },
      ];

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getCareerPaths).mockResolvedValue(
        mockCareerPaths
      );

      const result = await LocalDataService.getCareerPaths();

      expect(result).toEqual(mockCareerPaths);
      expect(StorageService.getCareerPaths).toHaveBeenCalled();
    });

    it("should get resources by category", async () => {
      const mockResources = [
        {
          id: "resource-1",
          title: "React Tutorial",
          type: "Course" as const,
          url: "https://example.com",
          description: "Learn React",
          categories: ["frontend"],
        },
      ];

      const { StorageService } = await import("../../services/storageService");
      vi.mocked(StorageService.getResourcesByCategory).mockResolvedValue(
        mockResources
      );

      const result = await LocalDataService.getResourcesByCategory("frontend");

      expect(result).toEqual(mockResources);
      expect(StorageService.getResourcesByCategory).toHaveBeenCalledWith(
        "frontend"
      );
    });
  });
});
