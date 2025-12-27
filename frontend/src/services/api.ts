import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
    baseURL: API_URL
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
  auth: {
      login: async (email: string, password: string) => {
          const response = await apiClient.post("/auth/login", { email, password });
          return response.data;
      },
      register: async (email: string, password: string) => {
          const response = await apiClient.post("/auth/register", { email, password });
          return response.data;
      },
      me: async () => {
          const response = await apiClient.get("/auth/me");
          return response.data;
      }
  },

  startInterview: async (role: string, difficulty: string, topic: string = "General") => {
    const response = await apiClient.post(`/interview/start`, {
      role,
      difficulty,
      topic,
    });
    return response.data; // { session_id, message }
  },

  submitAnswer: async (sessionId: string, answer: string, metrics?: any) => {
    const response = await apiClient.post(`/interview/chat`, {
      session_id: sessionId,
      answer,
      non_verbal_metrics: metrics,
    });
    return response.data; // { feedback, next_question, is_completed }
  },

  getSessions: async () => {
    const response = await apiClient.get(`/interview/history`);
    return response.data.map((session: any) => {
        let feedbackObj = undefined;
        if (session.feedback) {
            try {
                const parsed = JSON.parse(session.feedback);
                feedbackObj = {
                    overallScore: parsed.overall_score || 0,
                    strengths: parsed.strengths || [],
                    weaknesses: parsed.weaknesses || [],
                    detailedFeedback: parsed.final_verdict || "No verdict provided.",
                    recommendations: parsed.improvement_tips || [],
                    metrics: parsed.metrics || undefined // Extract metrics
                };
            } catch (e) {
                console.error("Failed to parse feedback JSON", e);
                feedbackObj = {
                   overallScore: 0,
                   strengths: [],
                   weaknesses: [],
                   detailedFeedback: session.feedback || "Raw feedback not parsing",
                   recommendations: [] 
                };
            }
        }

        return {
            id: session.id,
            userId: "user-1", // Mock
            startTime: session.start_time,
            endTime: session.end_time || undefined,
            jobTitle: session.role,
            feedback: feedbackObj,
            metrics: feedbackObj?.metrics // Map metrics to top level
        };
    });
  },

  sendAudioAnswer: async (sessionId: string, audioBlob: Blob, metrics?: any) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("audio_file", audioBlob, "answer.webm");
    if (metrics) {
        formData.append("non_verbal_metrics", JSON.stringify(metrics));
    }

    const response = await apiClient.post(`/interview/audio-chat`, formData);
    return response.data; // { feedback, next_question, is_completed }
  },

  endInterview: async (sessionId: string) => {
    const response = await apiClient.post(`/interview/end`, {
        session_id: sessionId
    });
    return response.data;
  },
};
