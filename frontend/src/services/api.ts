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

  submitAnswer: async (sessionId: string, answer: string, metrics?: any) => {
    const response = await axios.post(`${API_URL}/interview/chat`, {
      session_id: sessionId,
      answer,
      non_verbal_metrics: metrics,
    });
    return response.data; // { feedback, next_question, is_completed }
  },

  getSessions: async () => {
    const response = await axios.get(`${API_URL}/interview/history`);
    return response.data;
  },

  sendAudioAnswer: async (sessionId: string, audioBlob: Blob, metrics?: any) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("audio_file", audioBlob, "answer.webm");
    if (metrics) {
        formData.append("non_verbal_metrics", JSON.stringify(metrics));
    }

    const response = await axios.post(`${API_URL}/interview/audio-chat`, formData);
    return response.data; // { feedback, next_question, is_completed }
  },

  endInterview: async (sessionId: string) => {
    const response = await axios.post(`${API_URL}/interview/end`, {
        session_id: sessionId
    });
    return response.data;
  },
};
