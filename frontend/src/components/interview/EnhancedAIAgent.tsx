import React, { useEffect, useState } from "react";
import { localAIService, AIQuestion } from "../../services/localAIService";
import {
  ollamaBrowserService,
  InterviewAnalysis,
} from "../../services/ollamaBrowserService";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedAIAgentProps {
  onConnected?: () => void;
  onQuestionAsked?: (question: string) => void;
  onFeedbackProvided?: (feedback: string) => void;
  onAnalysisComplete?: (analysis: InterviewAnalysis) => void;
  userContext?: {
    role: string;
    experience: string;
    skills: string[];
  };
}

export const EnhancedAIAgent: React.FC<EnhancedAIAgentProps> = ({
  onConnected,
  onQuestionAsked,
  onFeedbackProvided,
  onAnalysisComplete,
  userContext = {
    role: "Software Developer",
    experience: "Mid-level",
    skills: ["JavaScript", "React", "Node.js"],
  },
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(
    null
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState<
    "greeting" | "questions" | "closing"
  >("greeting");
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<InterviewAnalysis | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<
    Array<{
      question: string;
      response: string;
      analysis: InterviewAnalysis;
    }>
  >([]);

  useEffect(() => {
    initializeAI();
  }, []);

  const initializeAI = async () => {
    try {
      // Check if Ollama is available with a timeout
      const ollamaStatus = await Promise.race([
        ollamaBrowserService.isAvailable(),
        new Promise<boolean>((resolve) =>
          setTimeout(() => resolve(false), 2000)
        ),
      ]);

      setOllamaAvailable(ollamaStatus);

      if (ollamaStatus) {
        const initialized = await ollamaBrowserService.initialize();
        if (initialized) {
          console.log("Enhanced AI with Ollama enabled");
        } else {
          console.log(
            "Ollama detected but failed to initialize, using fallback"
          );
          setOllamaAvailable(false);
        }
      } else {
        console.log("Ollama not available, using fallback AI service");
      }

      setIsLoading(false);
      if (onConnected) onConnected();
      startInterview();
    } catch (error) {
      console.error("Error initializing AI:", error);
      setOllamaAvailable(false);
      setIsLoading(false);
      if (onConnected) onConnected();
      startInterview();
    }
  };

  const startInterview = () => {
    setInterviewPhase("greeting");
    setTimeout(() => {
      askNextQuestion();
    }, 3000);
  };

  const askNextQuestion = async () => {
    try {
      let question: AIQuestion | null = null;

      if (ollamaAvailable) {
        // Use Ollama to generate dynamic questions
        const previousQuestions = interviewHistory.map((h) => h.question);
        const generatedQuestion =
          await ollamaBrowserService.generateInterviewQuestion(
            "technical", // Default category
            "medium", // Default difficulty
            previousQuestions
          );

        question = {
          id: `ollama_${Date.now()}`,
          question: generatedQuestion,
          category: "technical",
          difficulty: "medium",
          evaluationCriteria: [
            "technical_knowledge",
            "problem_solving",
            "communication",
          ],
        };
      } else {
        // Use local AI service
        question = localAIService.getNextQuestion();
      }

      if (question) {
        setCurrentQuestion(question);
        setInterviewPhase("questions");
        setIsSpeaking(true);

        if (onQuestionAsked) {
          onQuestionAsked(question.question);
        }

        // Simulate AI speaking time
        setTimeout(() => {
          setIsSpeaking(false);
        }, 3000);
      } else {
        // No more questions
        setInterviewPhase("closing");
        setIsSpeaking(true);
        setTimeout(() => {
          setIsSpeaking(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error asking question:", error);
      // Fallback to local service
      const question = localAIService.getNextQuestion();
      if (question) {
        setCurrentQuestion(question);
        setInterviewPhase("questions");
        setIsSpeaking(true);
        setTimeout(() => {
          setIsSpeaking(false);
        }, 3000);
      }
    }
  };

  const analyzeResponse = async (response: string) => {
    if (!currentQuestion) return;

    try {
      let analysis: InterviewAnalysis;

      if (ollamaAvailable) {
        analysis = await ollamaBrowserService.analyzeResponse(
          currentQuestion.question,
          response,
          userContext
        );
      } else {
        const localAnalysis = localAIService.analyzeResponse(
          currentQuestion.question,
          response
        );
        analysis = {
          strengths: localAnalysis.suggestions.filter((s) =>
            s.includes("Good")
          ),
          weaknesses: localAnalysis.suggestions.filter((s) =>
            s.includes("Try")
          ),
          suggestions: localAnalysis.suggestions,
          overallScore: 7.5, // Default score
          detailedFeedback: localAnalysis.feedback,
          nextQuestion: localAnalysis.nextQuestion,
        };
      }

      setCurrentAnalysis(analysis);
      setInterviewHistory((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          response,
          analysis,
        },
      ]);

      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }

      if (onFeedbackProvided) {
        onFeedbackProvided(analysis.detailedFeedback);
      }
    } catch (error) {
      console.error("Error analyzing response:", error);
    }
  };

  const getGreetingMessage = () => {
    const baseMessage =
      "Hello! I'm your AI interviewer today. I'll be asking you a series of questions to learn more about your experience and skills.";

    if (ollamaAvailable) {
      return `${baseMessage} I'm powered by advanced AI to provide personalized questions and detailed feedback. Let's start with you telling me a bit about yourself.`;
    }

    return `${baseMessage} Let's start with you telling me a bit about yourself.`;
  };

  const getClosingMessage = () => {
    if (ollamaAvailable) {
      return "Thank you for your time today. I've analyzed your responses and will provide detailed feedback. You've demonstrated strong qualifications, and we'll be in touch soon with next steps.";
    }

    return "Thank you for your time today. You've provided excellent answers and demonstrated strong qualifications. We'll be in touch soon with next steps.";
  };

  const getCurrentMessage = () => {
    switch (interviewPhase) {
      case "greeting":
        return getGreetingMessage();
      case "questions":
        return currentQuestion?.question || "";
      case "closing":
        return getClosingMessage();
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">
            {ollamaAvailable
              ? "Initializing enhanced AI..."
              : "Initializing AI interviewer..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* AI Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-40 h-40 rounded-full bg-gradient-to-r from-primary-700 to-secondary-700 mx-auto mb-6 flex items-center justify-center relative"
        >
          <span className="text-white text-4xl font-bold">AI</span>

          {/* AI Enhancement indicator */}
          {ollamaAvailable && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          )}

          {/* Speaking indicator */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 rounded-full border-4 border-white animate-pulse"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* AI Message */}
        <motion.div
          key={interviewPhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-2xl mx-auto bg-gray-800 bg-opacity-70 p-6 rounded-lg"
        >
          <p className="text-white text-lg leading-relaxed">
            {getCurrentMessage()}
          </p>

          {/* Question category and difficulty */}
          {currentQuestion && (
            <div className="mt-4 flex justify-center space-x-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                {currentQuestion.category}
              </span>
              <span
                className={`px-3 py-1 text-white text-sm rounded-full ${
                  currentQuestion.difficulty === "easy"
                    ? "bg-green-600"
                    : currentQuestion.difficulty === "medium"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                {currentQuestion.difficulty}
              </span>
              {ollamaAvailable && (
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  Enhanced AI
                </span>
              )}
            </div>
          )}

          {/* Current Analysis Display */}
          {currentAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-700 bg-opacity-50 rounded-lg text-left"
            >
              <h4 className="text-white font-semibold mb-2">
                Real-time Analysis:
              </h4>
              <div className="text-sm text-gray-300">
                <p>
                  <strong>Score:</strong> {currentAnalysis.overallScore}/10
                </p>
                <p>
                  <strong>Strengths:</strong>{" "}
                  {currentAnalysis.strengths.join(", ")}
                </p>
                {currentAnalysis.weaknesses.length > 0 && (
                  <p>
                    <strong>Areas to improve:</strong>{" "}
                    {currentAnalysis.weaknesses.join(", ")}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Interview progress */}
        <div className="mt-6">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div
              className={`w-3 h-3 rounded-full ${
                interviewPhase === "greeting" ? "bg-primary-500" : "bg-gray-600"
              }`}
            />
            <div
              className={`w-3 h-3 rounded-full ${
                interviewPhase === "questions"
                  ? "bg-primary-500"
                  : "bg-gray-600"
              }`}
            />
            <div
              className={`w-3 h-3 rounded-full ${
                interviewPhase === "closing" ? "bg-primary-500" : "bg-gray-600"
              }`}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {interviewPhase === "greeting" && "Welcome"}
            {interviewPhase === "questions" && "Interview in Progress"}
            {interviewPhase === "closing" && "Interview Complete"}
          </p>
        </div>

        {/* AI Status */}
        <div className="mt-4 text-xs">
          {ollamaAvailable ? (
            <span className="text-green-400 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Enhanced AI Mode (Ollama)
            </span>
          ) : (
            <div className="text-center">
              <span className="text-yellow-400 flex items-center justify-center mb-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Standard AI Mode (Local)
              </span>
              <div className="text-gray-500 text-xs">
                <a
                  href="/OLLAMA_SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-300"
                >
                  Install Ollama for enhanced AI features
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Next question button (for demo purposes) */}
        {interviewPhase === "questions" && !isSpeaking && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={askNextQuestion}
            className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Next Question
          </motion.button>
        )}

        {/* Response input for testing */}
        {interviewPhase === "questions" && currentQuestion && (
          <div className="mt-4">
            <textarea
              placeholder="Type your response here for analysis..."
              className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none"
              rows={3}
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  analyzeResponse(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <p className="text-xs text-gray-400 mt-1">
              Press Ctrl+Enter to analyze your response
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
