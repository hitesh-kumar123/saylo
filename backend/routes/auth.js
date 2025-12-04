import express from "express";
import { authService } from "../services/authService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = authService.register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/verify", authenticateToken, (req, res, next) => {
  try {
    const user = authService.getUserById(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
