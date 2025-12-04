import Dexie, { Table } from "dexie";

// Define the database schema
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  uploadDate: string;
  parsedData?: ParsedResumeData;
  fileSize: number;
  fileType: string;
}

export interface ParsedResumeData {
  skills: string[];
  experience: Experience[];
  education: Education[];
  summary?: string;
  extractedText: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  jobTitle: string;
  feedback?: InterviewFeedback;
  metrics?: InterviewMetrics;
  questions: InterviewQuestion[];
}

export interface InterviewFeedback {
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
  detailedFeedback: string;
  recommendations: string[];
}

export interface InterviewMetrics {
  eyeContact: number;
  confidence: number;
  clarity: number;
  enthusiasm: number;
  posture: number;
  emotionTimeline: EmotionDataPoint[];
}

export interface EmotionDataPoint {
  timestamp: number;
  emotion: string;
  intensity: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  userAnswer?: string;
  score?: number;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  growthRate: number;
  averageSalary: string;
  experienceLevel: string;
  recommendedResources: Resource[];
  nextSteps: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: "Article" | "Course" | "Book" | "Video" | "Documentation" | "Practice";
  url: string;
  description: string;
}

// Create the database class
class SayloDatabase extends Dexie {
  users!: Table<User>;
  resumes!: Table<Resume>;
  interviews!: Table<InterviewSession>;
  careerPaths!: Table<CareerPath>;
  resources!: Table<Resource>;

  constructor() {
    super("SayloDatabase");
    this.version(1).stores({
      users: "id, email, name, createdAt",
      resumes: "id, userId, fileName, uploadDate",
      interviews: "id, userId, startTime, jobTitle",
      careerPaths: "id, title, requiredSkills",
      resources: "id, title, type, categories",
    });
  }
}

// Create database instance
export const db = new SayloDatabase();

// Storage service class
export class StorageService {
  // User operations
  static async saveUser(user: User): Promise<void> {
    await db.users.put(user);
  }

  static async getUser(id: string): Promise<User | undefined> {
    return await db.users.get(id);
  }

  static async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.users.where("email").equals(email).first();
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await db.users.update(id, updates);
  }

  // Resume operations
  static async saveResume(resume: Resume): Promise<void> {
    await db.resumes.put(resume);
  }

  static async getResumes(userId: string): Promise<Resume[]> {
    return await db.resumes.where("userId").equals(userId).toArray();
  }

  static async getResume(id: string): Promise<Resume | undefined> {
    return await db.resumes.get(id);
  }

  static async deleteResume(id: string): Promise<void> {
    await db.resumes.delete(id);
  }

  // Interview operations
  static async saveInterview(interview: InterviewSession): Promise<void> {
    await db.interviews.put(interview);
  }

  static async getInterviews(userId: string): Promise<InterviewSession[]> {
    return await db.interviews.where("userId").equals(userId).toArray();
  }

  static async getInterview(id: string): Promise<InterviewSession | undefined> {
    return await db.interviews.get(id);
  }

  static async updateInterview(
    id: string,
    updates: Partial<InterviewSession>
  ): Promise<void> {
    await db.interviews.update(id, updates);
  }

  // Career path operations
  static async getCareerPaths(): Promise<CareerPath[]> {
    return await db.careerPaths.toArray();
  }

  static async saveCareerPaths(careerPaths: CareerPath[]): Promise<void> {
    await db.careerPaths.bulkPut(careerPaths);
  }

  // Resource operations
  static async getResources(): Promise<Resource[]> {
    return await db.resources.toArray();
  }

  static async saveResources(resources: Resource[]): Promise<void> {
    await db.resources.bulkPut(resources);
  }

  // Initialize with sample data
  static async initializeData(): Promise<void> {
    try {
      // Load career paths from JSON (try import first, then fetch)
      let careerPathsData;
      try {
        const careerPathsModule = await import("../data/careerPaths.json");
        careerPathsData = careerPathsModule.default || careerPathsModule;
      } catch {
        const careerPathsResponse = await fetch("/src/data/careerPaths.json");
        if (!careerPathsResponse.ok) throw new Error("Failed to fetch career paths");
        careerPathsData = await careerPathsResponse.json();
      }
      await this.saveCareerPaths(careerPathsData.paths || careerPathsData);

      // Load resources from JSON (try import first, then fetch)
      let resourcesData;
      try {
        const resourcesModule = await import("../data/resources.json");
        resourcesData = resourcesModule.default || resourcesModule;
      } catch {
        const resourcesResponse = await fetch("/src/data/resources.json");
        if (!resourcesResponse.ok) throw new Error("Failed to fetch resources");
        resourcesData = await resourcesResponse.json();
      }

      const allResources = [
        ...(resourcesData.learningResources || []),
        ...(resourcesData.interviewResources || []),
        ...(resourcesData.careerResources || []),
      ];
      await this.saveResources(allResources);
    } catch (error) {
      console.error("Error initializing data:", error);
      // Continue even if data loading fails
    }
  }

  // Clear all data (for testing)
  static async clearAllData(): Promise<void> {
    await db.users.clear();
    await db.resumes.clear();
    await db.interviews.clear();
    await db.careerPaths.clear();
    await db.resources.clear();
  }
}

// Initialize data on app start
StorageService.initializeData().catch(console.error);
