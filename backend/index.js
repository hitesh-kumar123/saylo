import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { corsOptions } from "./config/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resumes.js";
import interviewRoutes from "./routes/interviews.js";

const app = express();

// Middleware
app.use(cors(corsOptions(config.frontendOrigin)));
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/interviews", interviewRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
});
