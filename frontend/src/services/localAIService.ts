// Local AI service to replace Tavus API
export interface AIQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  followUp?: string;
  evaluationCriteria: string[];
}

export interface AIResponse {
  question: string;
  suggestions: string[];
  feedback: string;
  nextQuestion?: string;
}

export class LocalAIService {
  private questions: AIQuestion[] = [];
  private currentQuestionIndex: number = 0;
  private interviewContext: string = "";

  constructor() {
    this.loadQuestions();
  }

  // Load interview questions from local data
  private async loadQuestions() {
    try {
      const response = await fetch("/src/data/questions.json");
      const data = await response.json();

      // Flatten all questions into a single array
      this.questions = [
        ...data.behavioral,
        ...data.technical,
        ...data.situational,
      ];
    } catch (error) {
      console.error("Error loading questions:", error);
      // Fallback questions if JSON fails to load
      this.questions = this.getFallbackQuestions();
    }
  }

  // Fallback questions if JSON loading fails
  private getFallbackQuestions(): AIQuestion[] {
    return [
      {
        id: "f1",
        question: "Tell me about yourself.",
        category: "introduction",
        difficulty: "easy",
        followUp: "What interests you most about this role?",
        evaluationCriteria: ["communication", "clarity", "confidence"],
      },
      {
        id: "f2",
        question: "What are your greatest strengths?",
        category: "strengths",
        difficulty: "easy",
        followUp: "Can you give me a specific example?",
        evaluationCriteria: ["self_awareness", "examples", "communication"],
      },
      {
        id: "f3",
        question: "Describe a challenging project you worked on.",
        category: "experience",
        difficulty: "medium",
        followUp: "How did you overcome the challenges?",
        evaluationCriteria: ["problem_solving", "communication", "examples"],
      },
    ];
  }

  // Get the next interview question
  getNextQuestion(): AIQuestion | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null; // No more questions
    }

    const question = this.questions[this.currentQuestionIndex];
    this.currentQuestionIndex++;
    return question;
  }

  // Get a random question from a specific category
  getRandomQuestion(category?: string): AIQuestion | null {
    let filteredQuestions = this.questions;

    if (category) {
      filteredQuestions = this.questions.filter((q) => q.category === category);
    }

    if (filteredQuestions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  }

  // Analyze user response and provide feedback
  analyzeResponse(question: string, userResponse: string): AIResponse {
    const responseLength = userResponse.length;
    const wordCount = userResponse.split(" ").length;

    // Simple analysis based on response characteristics
    const suggestions: string[] = [];
    const feedback: string[] = [];

    // Length analysis
    if (wordCount < 20) {
      suggestions.push("Try to provide more detail in your answer");
      feedback.push(
        "Your answer was quite brief. Consider adding more context."
      );
    } else if (wordCount > 200) {
      suggestions.push("Try to be more concise");
      feedback.push("Your answer was quite long. Consider being more direct.");
    } else {
      feedback.push("Good length for your response");
    }

    // Check for STAR method usage (for behavioral questions)
    if (
      question.toLowerCase().includes("time") ||
      question.toLowerCase().includes("situation")
    ) {
      const hasSituation =
        userResponse.toLowerCase().includes("situation") ||
        userResponse.toLowerCase().includes("when") ||
        userResponse.toLowerCase().includes("time");
      const hasTask =
        userResponse.toLowerCase().includes("task") ||
        userResponse.toLowerCase().includes("responsibility");
      const hasAction =
        userResponse.toLowerCase().includes("action") ||
        userResponse.toLowerCase().includes("did") ||
        userResponse.toLowerCase().includes("implemented");
      const hasResult =
        userResponse.toLowerCase().includes("result") ||
        userResponse.toLowerCase().includes("outcome") ||
        userResponse.toLowerCase().includes("achieved");

      if (!hasSituation) {
        suggestions.push("Start by describing the situation or context");
      }
      if (!hasTask) {
        suggestions.push("Explain your specific task or responsibility");
      }
      if (!hasAction) {
        suggestions.push("Detail the actions you took");
      }
      if (!hasResult) {
        suggestions.push("Describe the results or outcomes");
      }

      if (hasSituation && hasTask && hasAction && hasResult) {
        feedback.push("Excellent use of the STAR method!");
      }
    }

    // Check for specific examples
    if (
      !userResponse.toLowerCase().includes("example") &&
      !userResponse.toLowerCase().includes("for instance") &&
      !userResponse.toLowerCase().includes("specifically")
    ) {
      suggestions.push("Consider providing a specific example");
    }

    // Confidence indicators
    const confidenceWords = [
      "confident",
      "successful",
      "achieved",
      "accomplished",
      "exceeded",
    ];
    const hasConfidenceWords = confidenceWords.some((word) =>
      userResponse.toLowerCase().includes(word)
    );

    if (hasConfidenceWords) {
      feedback.push("Good use of confident language");
    } else {
      suggestions.push("Use more confident and positive language");
    }

    // Generate next question based on current response
    const nextQuestion = this.generateFollowUpQuestion(question, userResponse);

    return {
      question:
        nextQuestion ||
        "Thank you for that answer. Let me ask you another question.",
      suggestions,
      feedback: feedback.join(" "),
      nextQuestion,
    };
  }

  // Generate a follow-up question based on the current response
  private generateFollowUpQuestion(
    originalQuestion: string,
    userResponse: string
  ): string | null {
    const followUpQuestions = [
      "Can you tell me more about that?",
      "What was the most challenging part?",
      "How did you measure success?",
      "What would you do differently next time?",
      "Can you give me a specific example?",
      "What did you learn from that experience?",
      "How did others react to your approach?",
      "What resources did you use?",
    ];

    // Simple logic to select appropriate follow-up
    if (userResponse.length < 50) {
      return "Can you provide more detail about that?";
    } else if (userResponse.toLowerCase().includes("challenge")) {
      return "How did you overcome that challenge?";
    } else if (userResponse.toLowerCase().includes("team")) {
      return "How did you work with your team on this?";
    } else {
      return followUpQuestions[
        Math.floor(Math.random() * followUpQuestions.length)
      ];
    }
  }

  // Get interview tips based on performance
  getInterviewTips(performance: {
    eyeContact: number;
    confidence: number;
    clarity: number;
    enthusiasm: number;
  }): string[] {
    const tips: string[] = [];

    if (performance.eyeContact < 0.7) {
      tips.push("Try to maintain more eye contact with the camera");
    }

    if (performance.confidence < 0.6) {
      tips.push("Speak with more confidence and authority");
    }

    if (performance.clarity < 0.8) {
      tips.push("Speak more clearly and at a moderate pace");
    }

    if (performance.enthusiasm < 0.7) {
      tips.push("Show more enthusiasm and energy in your responses");
    }

    if (tips.length === 0) {
      tips.push("Great job! Keep up the excellent performance");
    }

    return tips;
  }

  // Reset the interview session
  resetInterview() {
    this.currentQuestionIndex = 0;
    this.interviewContext = "";
  }

  // Get interview statistics
  getInterviewStats() {
    return {
      totalQuestions: this.questions.length,
      currentQuestion: this.currentQuestionIndex,
      remainingQuestions: this.questions.length - this.currentQuestionIndex,
    };
  }
}

// Global AI service instance
export const localAIService = new LocalAIService();
