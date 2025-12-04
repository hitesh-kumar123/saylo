import { v4 as uuidv4 } from "uuid";
import { db } from "../db/database.js";

export const resumeService = {
  createResume: (userId, fileName = "resume.pdf") => {
    const resume = {
      id: uuidv4(),
      userId,
      fileName,
      uploadDate: new Date().toISOString(),
      parsedData: {
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
      },
    };

    db.resumes.push(resume);
    return resume;
  },

  getResumes: (userId) => {
    return db.resumes.filter((r) => r.userId === userId);
  },

  getResumeById: (resumeId, userId) => {
    const resume = db.resumes.find(
      (r) => r.id === resumeId && r.userId === userId
    );
    if (!resume) {
      throw { status: 404, message: "Resume not found" };
    }
    return resume;
  },
};
