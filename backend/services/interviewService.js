import { v4 as uuidv4 } from "uuid";
import { db } from "../db/database.js";

export const interviewService = {
  createInterview: (userId, jobTitle) => {
    const interview = {
      id: uuidv4(),
      userId,
      jobTitle,
      startTime: new Date().toISOString(),
      status: "in-progress",
    };

    db.interviews.push(interview);
    return interview;
  },

  endInterview: (interviewId, userId) => {
    const interviewIndex = db.interviews.findIndex(
      (i) => i.id === interviewId && i.userId === userId
    );

    if (interviewIndex === -1) {
      throw { status: 404, message: "Interview not found" };
    }

    const interview = db.interviews[interviewIndex];
    interview.endTime = new Date().toISOString();
    interview.status = "completed";
    interview.feedback = {
      strengths: [
        "Good communication",
        "Structured answers",
        "Technical knowledge",
      ],
      weaknesses: ["Could improve conciseness", "More examples needed"],
      overallScore: 7.5,
      detailedFeedback:
        "You demonstrated strong technical knowledge and communicated clearly.",
    };
    interview.metrics = {
      eyeContact: 0.75,
      confidence: 0.65,
      clarity: 0.82,
      enthusiasm: 0.7,
      posture: 0.6,
    };

    db.interviews[interviewIndex] = interview;
    return interview;
  },

  getInterviews: (userId) => {
    return db.interviews.filter((i) => i.userId === userId);
  },

  getInterviewById: (interviewId, userId) => {
    const interview = db.interviews.find(
      (i) => i.id === interviewId && i.userId === userId
    );
    if (!interview) {
      throw { status: 404, message: "Interview not found" };
    }
    return interview;
  },
};
