import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const users = [];
const resumes = [];
const interviews = [];
const careerPaths = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.user = user;
      next();
    }
  );
};

// Auth routes
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const user = {
    id: uuidv4(),
    name,
    email,
    password, // In a real app, this would be hashed
  };

  users.push(user);

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" } // Increased token expiry to 24 hours
  );

  // Return user info (without password) and token
  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check password
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" } // Increased token expiry to 24 hours
  );

  // Return user info (without password) and token
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

// Add a token verification endpoint
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  // If middleware passes, token is valid
  // Find the user by id from the token
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Return user data
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Resume routes
app.post("/api/resumes", authenticateToken, (req, res) => {
  // In a real app, this would handle file upload and parsing
  const userId = req.user.id;

  // Mock resume data
  const resume = {
    id: uuidv4(),
    userId,
    fileName: "resume.pdf",
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
        {
          company: "Startup XYZ",
          position: "Junior Developer",
          startDate: "2018-05",
          endDate: "2019-12",
          description:
            "Built and maintained client websites using modern JavaScript frameworks.",
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

  resumes.push(resume);

  res.status(201).json(resume);
});

app.get("/api/resumes", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userResumes = resumes.filter((r) => r.userId === userId);

  res.json(userResumes);
});

// Interview routes
app.post("/api/interviews", authenticateToken, (req, res) => {
  const { jobTitle } = req.body;
  const userId = req.user.id;

  const interview = {
    id: uuidv4(),
    userId,
    jobTitle,
    startTime: new Date().toISOString(),
  };

  interviews.push(interview);

  res.status(201).json(interview);
});

app.post("/api/interviews/:id/end", authenticateToken, (req, res) => {
  const interviewId = req.params.id;
  const userId = req.user.id;

  const interviewIndex = interviews.findIndex(
    (i) => i.id === interviewId && i.userId === userId
  );

  if (interviewIndex === -1) {
    return res.status(404).json({ message: "Interview not found" });
  }

  // Update interview with end time and mock feedback
  interviews[interviewIndex] = {
    ...interviews[interviewIndex],
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

  res.json(interviews[interviewIndex]);
});

app.get("/api/interviews", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userInterviews = interviews.filter((i) => i.userId === userId);

  res.json(userInterviews);
});

// Career paths routes
app.get("/api/career-paths", authenticateToken, (req, res) => {
  // Mock career paths data would be returned here
  res.json([]);
});

app.get("/api/career-paths/recommended", authenticateToken, (req, res) => {
  const resumeId = req.query.resumeId;

  if (!resumeId) {
    return res.status(400).json({ message: "Resume ID is required" });
  }

  // Mock recommended career paths based on resume
  res.json([]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
