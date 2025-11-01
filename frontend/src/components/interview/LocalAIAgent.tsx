import React, { useEffect, useState } from "react";
import { localAIService, AIQuestion } from "../../services/localAIService";
import { motion, AnimatePresence } from "framer-motion";

interface LocalAIAgentProps {
  onConnected?: () => void;
  onQuestionAsked?: (question: string) => void;
  onFeedbackProvided?: (feedback: string) => void;
}

export const LocalAIAgent: React.FC<LocalAIAgentProps> = ({
  onConnected,
  onQuestionAsked,
  onFeedbackProvided,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(
    null
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState<
    "greeting" | "questions" | "closing"
  >("greeting");

  useEffect(() => {
    // Simulate AI agent initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onConnected) onConnected();
      startInterview();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onConnected]);

  const startInterview = () => {
    setInterviewPhase("greeting");
    setTimeout(() => {
      askNextQuestion();
    }, 3000);
  };

  const askNextQuestion = () => {
    const question = localAIService.getNextQuestion();
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
  };

  const getGreetingMessage = () => {
    return "Hello! I'm your AI interviewer today. I'll be asking you a series of questions to learn more about your experience and skills. Let's start with you telling me a bit about yourself.";
  };

  const getClosingMessage = () => {
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
          <p className="text-white">Initializing AI interviewer...</p>
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
            </div>
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
      </div>
    </div>
  );
};
