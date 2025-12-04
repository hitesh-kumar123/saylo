import { v4 as uuidv4 } from "uuid";
import { db } from "../db/database.js";
import { generateToken } from "../utils/jwt.js";
import { validateUser } from "../utils/validators.js";

export const authService = {
  register: (name, email, password) => {
    const validation = validateUser({ name, email, password });
    if (!validation.valid) {
      throw { status: 400, message: validation.message };
    }

    const existingUser = db.users.find((u) => u.email === email);
    if (existingUser) {
      throw { status: 400, message: "User already exists" };
    }

    const user = {
      id: uuidv4(),
      name,
      email,
      password, // In production, hash this
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  login: (email, password) => {
    const user = db.users.find((u) => u.email === email);

    if (!user || user.password !== password) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  getUserById: (userId) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
};
