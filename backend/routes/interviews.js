import express from "express";
import { interviewService } from "../services/interviewService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, (req, res, next) => {
  try {
    const { jobTitle } = req.body;
    const interview = interviewService.createInterview(req.user.id, jobTitle);
    res.status(201).json(interview);
  } catch (err) {
    next(err);
  }
});

router.get("/", authenticateToken, (req, res, next) => {
  try {
    const interviews = interviewService.getInterviews(req.user.id);
    res.json(interviews);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authenticateToken, (req, res, next) => {
  try {
    const interview = interviewService.getInterviewById(
      req.params.id,
      req.user.id
    );
    res.json(interview);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/end", authenticateToken, (req, res, next) => {
  try {
    const interview = interviewService.endInterview(req.params.id, req.user.id);
    res.json(interview);
  } catch (err) {
    next(err);
  }
});

export default router;
