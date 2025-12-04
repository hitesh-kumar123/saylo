import express from "express";
import { resumeService } from "../services/resumeService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, (req, res, next) => {
  try {
    const resume = resumeService.createResume(req.user.id, req.body.fileName);
    res.status(201).json(resume);
  } catch (err) {
    next(err);
  }
});

router.get("/", authenticateToken, (req, res, next) => {
  try {
    const resumes = resumeService.getResumes(req.user.id);
    res.json(resumes);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authenticateToken, (req, res, next) => {
  try {
    const resume = resumeService.getResumeById(req.params.id, req.user.id);
    res.json(resume);
  } catch (err) {
    next(err);
  }
});

export default router;
