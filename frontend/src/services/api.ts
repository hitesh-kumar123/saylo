import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const api = {
  startInterview: async (role: string, difficulty: string, topic: string = "General") => {
    const response = await axios.post(`${API_URL}/interview/start`, {
      role,
      difficulty,
      topic,
    });
    return response.data; // { session_id, message }
  },

  submitAnswer: async (sessionId: string, answer: string) => {
    const response = await axios.post(`${API_URL}/interview/chat`, {
      session_id: sessionId,
      answer,
    });
    return response.data; // { feedback, next_question, is_completed }
  },
};
