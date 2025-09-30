// Local data service to replace API calls
import { StorageService } from "./storageService";
import {
  User,
  Resume,
  InterviewSession,
  CareerPath,
  Resource,
} from "./storageService";
import { ParsedResumeData } from "./pdfParserService";

export class LocalDataService {
  // Authentication methods
  static async login(
    email: string,
    _password: string
  ): Promise<{ user: User; token: string }> {
    // Simulate login - in real app, you'd verify password hash
    const user = await StorageService.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    // Generate a simple token (in real app, use JWT)
    const token = btoa(`${user.id}:${Date.now()}`);

    // Update last login
    await StorageService.updateUser(user.id, {
      lastLogin: new Date().toISOString(),
    });

    return { user, token };
  }

  static async register(
    name: string,
    email: string,
    _password: string
  ): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await StorageService.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create new user
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await StorageService.saveUser(user);

    // Generate token
    const token = btoa(`${user.id}:${Date.now()}`);

    return { user, token };
  }

  static async verifyToken(token: string): Promise<User> {
    try {
      const decoded = atob(token);
      const [userId] = decoded.split(":");
      const user = await StorageService.getUser(userId);

      if (!user) {
        throw new Error("Invalid token");
      }

      return user;
    } catch {
      throw new Error("Invalid token");
    }
  }

  // Resume methods
  static async uploadResume(
    userId: string,
    file: File,
    parsedData?: ParsedResumeData
  ): Promise<Resume> {
    // Simulate resume parsing
    const resume: Resume = {
      id: crypto.randomUUID(),
      userId,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      fileSize: file.size,
      fileType: file.type,
      parsedData: parsedData || {
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML/CSS"],
        experience: [
          {
            company: "Tech Company Inc.",
            position: "Frontend Developer",
            startDate: "2020-01",
            endDate: "2022-06",
            description:
              "Developed responsive web applications using React and TypeScript.",
          },
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor of Science",
            field: "Computer Science",
            graduationDate: "2018",
          },
        ],
        summary:
          "Frontend developer with 4+ years of experience building responsive web applications.",
        extractedText: "Sample extracted text from resume...",
      },
    };

    await StorageService.saveResume(resume);
    return resume;
  }

  static async getResumes(userId: string): Promise<Resume[]> {
    return await StorageService.getResumes(userId);
  }

  // Interview methods
  static async startInterview(
    userId: string,
    jobTitle: string
  ): Promise<InterviewSession> {
    const interview: InterviewSession = {
      id: crypto.randomUUID(),
      userId,
      jobTitle,
      startTime: new Date().toISOString(),
      questions: [],
    };

    await StorageService.saveInterview(interview);
    return interview;
  }

  static async endInterview(interviewId: string): Promise<InterviewSession> {
    const interview = await StorageService.getInterview(interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    const updatedInterview: InterviewSession = {
      ...interview,
      endTime: new Date().toISOString(),
      feedback: {
        strengths: [
          "Good communication",
          "Structured answers",
          "Technical knowledge",
        ],
        weaknesses: ["Could improve conciseness", "More examples needed"],
        overallScore: 7.5,
        detailedFeedback:
          "You demonstrated strong technical knowledge and communicated clearly. Your answers were well-structured using the STAR method. To improve, try to be more concise and provide more specific examples of your work.",
        recommendations: [
          "Practice with more behavioral questions",
          "Work on being more concise",
          "Prepare more specific examples",
        ],
      },
      metrics: {
        eyeContact: 0.75,
        confidence: 0.65,
        clarity: 0.82,
        enthusiasm: 0.7,
        posture: 0.6,
        emotionTimeline: [],
      },
    };

    await StorageService.updateInterview(interviewId, updatedInterview);
    return updatedInterview;
  }

  static async getInterviews(userId: string): Promise<InterviewSession[]> {
    return await StorageService.getInterviews(userId);
  }

  // Career path methods
  static async getCareerPaths(): Promise<CareerPath[]> {
    return await StorageService.getCareerPaths();
  }

  static async getRecommendedPaths(resumeId: string): Promise<CareerPath[]> {
    // Get all career paths and filter based on resume skills
    const allPaths = await StorageService.getCareerPaths();
    const resume = await StorageService.getResume(resumeId);

    if (!resume || !resume.parsedData) {
      return allPaths.slice(0, 3); // Return first 3 if no resume data
    }

    const userSkills = resume.parsedData.skills;

    // Score career paths based on skill overlap
    const scoredPaths = allPaths.map((path) => ({
      ...path,
      score: path.requiredSkills.filter((skill) =>
        userSkills.some(
          (userSkill) =>
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ).length,
    }));

    // Sort by score and return top 3
    return scoredPaths
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ score, ...path }) => path);
  }

  // Resource methods
  static async getResources(): Promise<Resource[]> {
    return await StorageService.getResources();
  }

  static async getResourcesByCategory(category: string): Promise<Resource[]> {
    const allResources = await StorageService.getResources();
    return allResources.filter((resource) =>
      resource.description.toLowerCase().includes(category.toLowerCase())
    );
  }
}
