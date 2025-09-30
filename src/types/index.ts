export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  uploadDate: string;
  parsedData?: ParsedResumeData;
}

export interface ParsedResumeData {
  skills: string[];
  experience: Experience[];
  education: Education[];
  summary?: string;
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
}

export interface InterviewFeedback {
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
  detailedFeedback: string;
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

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  growthRate: number;
  averageSalary: string;
  recommendedResources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: "Article" | "Course" | "Book" | "Video";
  url: string;
  description: string;
}

export interface TavusConfig {
  replicaId: string;
  personaId: string;
  apiKey: string;
}
