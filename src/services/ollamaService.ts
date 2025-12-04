// Ollama service for advanced local AI capabilities
import { Ollama } from "ollama";

export interface OllamaConfig {
  host: string;
  model: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export interface AIResponse {
  response: string;
  model: string;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface InterviewAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallScore: number;
  detailedFeedback: string;
  nextQuestion?: string;
}

export class OllamaService {
  private ollama: Ollama;
  private config: OllamaConfig;
  private isConnected: boolean = false;

  constructor(config?: Partial<OllamaConfig>) {
    this.config = {
      host: "http://localhost:11434",
      model: "llama3.2:3b", // Lightweight model for interviews
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1000,
      ...config,
    };

    this.ollama = new Ollama({
      host: this.config.host,
    });
  }

  // Initialize connection to Ollama
  async initialize(): Promise<boolean> {
    try {
      // Check if Ollama is running
      const models = await this.ollama.list();
      this.isConnected = true;
      console.log("Ollama connected successfully");
      console.log(
        "Available models:",
        models.models.map((m) => m.name)
      );
      return true;
    } catch (error) {
      console.error("Failed to connect to Ollama:", error);
      this.isConnected = false;
      return false;
    }
  }

  // Check if Ollama is available
  async isAvailable(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch {
      return false;
    }
  }

  // Generate interview questions
  async generateInterviewQuestion(
    category: string,
    difficulty: string,
    previousQuestions: string[] = []
  ): Promise<string> {
    if (!this.isConnected) {
      return this.getFallbackQuestion(category, difficulty);
    }

    const prompt = `Generate a professional interview question for a ${category} position with ${difficulty} difficulty level. 
    Previous questions asked: ${previousQuestions.join(", ")}
    
    Requirements:
    - Be specific and relevant to the role
    - Test both technical and soft skills
    - Encourage detailed responses
    - Professional and respectful tone
    
    Return only the question, no additional text.`;

    try {
      const response = await this.ollama.generate({
        model: this.config.model,
        prompt,
        options: {
          temperature: this.config.temperature,
          top_p: this.config.top_p,
        },
      });

      return response.response.trim();
    } catch (error) {
      console.error("Error generating question:", error);
      return this.getFallbackQuestion(category, difficulty);
    }
  }

  // Analyze interview response
  async analyzeResponse(
    question: string,
    response: string,
    context: {
      role: string;
      experience: string;
      skills: string[];
    }
  ): Promise<InterviewAnalysis> {
    if (!this.isConnected) {
      return this.getFallbackAnalysis(question, response);
    }

    const prompt = `Analyze this interview response and provide detailed feedback.

    Question: "${question}"
    Response: "${response}"
    Role: ${context.role}
    Experience: ${context.experience}
    Skills: ${context.skills.join(", ")}

    Provide analysis in this JSON format:
    {
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "suggestions": ["suggestion1", "suggestion2"],
      "overallScore": 7.5,
      "detailedFeedback": "Detailed feedback here",
      "nextQuestion": "Follow-up question"
    }

    Focus on:
    - Communication clarity
    - Technical knowledge demonstration
    - Problem-solving approach
    - STAR method usage (if applicable)
    - Confidence and enthusiasm
    - Specific examples provided

    Return only valid JSON.`;

    try {
      const aiResponse = await this.ollama.generate({
        model: this.config.model,
        prompt,
        options: {
          temperature: 0.3, // Lower temperature for more consistent analysis
          top_p: 0.8,
        },
      });

      const analysis = JSON.parse(aiResponse.response);
      return analysis;
    } catch (error) {
      console.error("Error analyzing response:", error);
      return this.getFallbackAnalysis(question, response);
    }
  }

  // Generate follow-up questions
  async generateFollowUpQuestion(
    originalQuestion: string,
    response: string,
    category: string
  ): Promise<string> {
    if (!this.isConnected) {
      return this.getFallbackFollowUp();
    }

    const prompt = `Based on this interview response, generate a relevant follow-up question.

    Original Question: "${originalQuestion}"
    Response: "${response}"
    Category: ${category}

    Generate a follow-up question that:
    - Builds on the response given
    - Digs deeper into the topic
    - Tests different aspects of the skill
    - Encourages specific examples

    Return only the question.`;

    try {
      const aiResponse = await this.ollama.generate({
        model: this.config.model,
        prompt,
        options: {
          temperature: this.config.temperature,
        },
      });

      return aiResponse.response.trim();
    } catch (error) {
      console.error("Error generating follow-up:", error);
      return this.getFallbackFollowUp();
    }
  }

  // Generate interview summary
  async generateInterviewSummary(
    questions: Array<{
      question: string;
      response: string;
      analysis: InterviewAnalysis;
    }>,
    overallMetrics: {
      eyeContact: number;
      confidence: number;
      clarity: number;
      enthusiasm: number;
    }
  ): Promise<string> {
    if (!this.isConnected) {
      return this.getFallbackSummary();
    }

    const prompt = `Generate a comprehensive interview summary based on the following data:

    Questions and Responses:
    ${questions
      .map(
        (q, i) => `
    Q${i + 1}: ${q.question}
    A${i + 1}: ${q.response}
    Analysis: ${q.analysis.detailedFeedback}
    `
      )
      .join("\n")}

    Overall Performance Metrics:
    - Eye Contact: ${overallMetrics.eyeContact}/10
    - Confidence: ${overallMetrics.confidence}/10
    - Clarity: ${overallMetrics.clarity}/10
    - Enthusiasm: ${overallMetrics.enthusiasm}/10

    Provide a professional summary that includes:
    - Overall performance assessment
    - Key strengths demonstrated
    - Areas for improvement
    - Recommendations for next steps
    - Final recommendation (hire/not hire/consider)

    Keep it professional and constructive.`;

    try {
      const aiResponse = await this.ollama.generate({
        model: this.config.model,
        prompt,
        options: {
          temperature: 0.4,
        },
      });

      return aiResponse.response.trim();
    } catch (error) {
      console.error("Error generating summary:", error);
      return this.getFallbackSummary();
    }
  }

  // Fallback methods when Ollama is not available
  private getFallbackQuestion(category: string, difficulty: string): string {
    const questions = {
      technical: {
        easy: "What programming languages are you most comfortable with?",
        medium:
          "How would you approach debugging a performance issue in a web application?",
        hard: "Explain the difference between microservices and monolithic architecture, and when you would use each.",
      },
      behavioral: {
        easy: "Tell me about a time when you had to work with a difficult team member.",
        medium:
          "Describe a situation where you had to learn a new technology quickly.",
        hard: "Give me an example of a project where you had to make a difficult technical decision.",
      },
      situational: {
        easy: "How do you prioritize your tasks when you have multiple deadlines?",
        medium:
          "What would you do if you disagreed with your manager's technical approach?",
        hard: "How would you handle a situation where a critical system goes down during peak hours?",
      },
    };

    return (
      questions[category as keyof typeof questions]?.[
        difficulty as keyof typeof questions.technical
      ] || "Tell me about a challenging project you worked on recently."
    );
  }

  private getFallbackAnalysis(
    question: string,
    response: string
  ): InterviewAnalysis {
    const wordCount = response.split(" ").length;
    const hasExample =
      response.toLowerCase().includes("example") ||
      response.toLowerCase().includes("for instance");
    const hasNumbers = /\d+/.test(response);

    return {
      strengths: [
        hasExample ? "Provided specific examples" : "Good communication",
        wordCount > 50 ? "Detailed response" : "Concise answer",
        hasNumbers ? "Used quantifiable data" : "Clear explanation",
      ],
      weaknesses: [
        !hasExample ? "Could provide more specific examples" : "",
        wordCount < 30 ? "Response could be more detailed" : "",
        !hasNumbers ? "Consider using metrics or data" : "",
      ].filter(Boolean),
      suggestions: [
        "Try to use the STAR method for behavioral questions",
        "Include specific examples from your experience",
        "Quantify your achievements when possible",
      ],
      overallScore: Math.min(
        8,
        Math.max(
          5,
          wordCount / 10 + (hasExample ? 1 : 0) + (hasNumbers ? 1 : 0)
        )
      ),
      detailedFeedback: `Your response was ${
        wordCount > 50 ? "detailed" : "brief"
      } and ${
        hasExample
          ? "included good examples"
          : "could benefit from more specific examples"
      }.`,
      nextQuestion: "Can you tell me more about that experience?",
    };
  }

  private getFallbackFollowUp(): string {
    const followUps = [
      "Can you tell me more about that?",
      "What was the most challenging part?",
      "How did you measure success?",
      "What would you do differently next time?",
      "Can you give me a specific example?",
    ];
    return followUps[Math.floor(Math.random() * followUps.length)];
  }

  private getFallbackSummary(): string {
    return `Interview Summary:
    
    The candidate demonstrated good communication skills and provided relevant examples throughout the interview. They showed technical knowledge appropriate for the role and handled questions professionally.
    
    Key Strengths:
    - Clear communication
    - Relevant experience
    - Professional demeanor
    
    Areas for Improvement:
    - Could provide more specific examples
    - Consider using metrics to quantify achievements
    
    Recommendation: The candidate shows potential and would benefit from additional experience in the specific technologies mentioned. Consider for next round of interviews.`;
  }

  // Get available models
  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.ollama.list();
      return models.models.map((m) => m.name);
    } catch {
      return [];
    }
  }

  // Change model
  async setModel(modelName: string): Promise<boolean> {
    try {
      const models = await this.getAvailableModels();
      if (models.includes(modelName)) {
        this.config.model = modelName;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Get current configuration
  getConfig(): OllamaConfig {
    return { ...this.config };
  }

  // Check connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Global Ollama service instance
export const ollamaService = new OllamaService();
