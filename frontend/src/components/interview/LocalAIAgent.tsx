import React, { useEffect, useState } from "react";
import { localAIService, AIQuestion } from "../../services/localAIService";
import { useInterviewStore } from "../../store/interviewStore";
import { motion, AnimatePresence } from "framer-motion";

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

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
  const { addQuestionResponse } = useInterviewStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(
    null
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState<
    "greeting" | "questions" | "closing"
  >("greeting");
  const [userResponse, setUserResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    let recognitionInstance: SpeechRecognition | null = null;

    // Initialize voice recognition if available
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setUserResponse((prev) => prev + finalTranscript);
          } else if (interimTranscript) {
            setUserResponse((prev) => {
              // Remove previous interim results
              const parts = prev.split(" ");
              const lastPart = parts[parts.length - 1];
              if (interimTranscript.includes(lastPart)) {
                return prev;
              }
              return prev + interimTranscript;
            });
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognitionInstance.onend = () => {
          // Use a closure to check current recording state and restart if needed
          setIsRecording((currentIsRecording) => {
            if (currentIsRecording && recognitionInstance) {
              // Small delay before restarting to prevent immediate restart
              setTimeout(() => {
                setIsRecording((stillRecording) => {
                  if (stillRecording && recognitionInstance) {
                    try {
                      recognitionInstance.start();
                      return true;
                    } catch (e) {
                      console.warn("Could not restart recognition:", e);
                      return false;
                    }
                  }
                  return stillRecording;
                });
              }, 100);
              return true;
            }
            return currentIsRecording;
          });
        };

        setRecognition(recognitionInstance);
      }
    }

    // Initialize AI agent immediately
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onConnected) onConnected();
      startInterview();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [onConnected]);

  const startInterview = () => {
    setInterviewPhase("greeting");
    // Start asking questions faster (2 seconds instead of 3)
    setTimeout(() => {
      askNextQuestion();
    }, 2000);
  };

  const askNextQuestion = () => {
    // Clear previous response
    setUserResponse("");
    setFeedback("");

    const question = localAIService.getNextQuestion();
    if (question) {
      setCurrentQuestion(question);
      setInterviewPhase("questions");
      setIsSpeaking(true);

      if (onQuestionAsked) {
        onQuestionAsked(question.question);
      }

      // Simulate AI speaking time (reduced to 2 seconds for faster response)
      setTimeout(() => {
        setIsSpeaking(false);
        // Scroll to response input when question finishes
        setTimeout(() => {
          const responseElement = document.querySelector('[data-response-input]');
          if (responseElement) {
            responseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }, 2000); // Reduced from 3000ms to 2000ms
    } else {
      // No more questions
      setInterviewPhase("closing");
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    }
  };

  const analyzeResponse = (response: string) => {
    if (!currentQuestion || !response.trim()) {
      return;
    }

    const analysis = localAIService.analyzeResponse(
      currentQuestion.question,
      response
    );

    setFeedback(analysis.feedback);

    if (onFeedbackProvided) {
      onFeedbackProvided(analysis.feedback);
    }

    // Store in interview session
    if (currentQuestion) {
      addQuestionResponse(
        currentQuestion.id,
        currentQuestion.question,
        response
      );
      
      console.log("Question answered:", {
        question: currentQuestion.question,
        answer: response,
        feedback: analysis.feedback,
      });
    }
  };

  const handleSubmitResponse = () => {
    if (userResponse.trim()) {
      analyzeResponse(userResponse);
      // Wait a bit then ask next question
      setTimeout(() => {
        askNextQuestion();
      }, 2000);
    }
  };

  const toggleRecording = async () => {
    const currentRecognition = recognition;
    if (!currentRecognition) {
      alert("Voice recognition is not available in your browser. Please use text input or Chrome/Edge.");
      return;
    }

    if (isRecording) {
      try {
        currentRecognition.stop();
        setIsRecording(false);
      } catch (error) {
        console.error("Error stopping recognition:", error);
        setIsRecording(false);
      }
    } else {
      try {
        // Request microphone permission first
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permError) {
          alert("Microphone permission is required for voice input. Please allow microphone access.");
          return;
        }
        
        currentRecognition.start();
        setIsRecording(true);
        console.log("Voice recognition started");
      } catch (error) {
        console.error("Error starting recognition:", error);
        setIsRecording(false);
        alert("Failed to start voice recognition. Please check your microphone permissions.");
      }
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
    <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center overflow-y-auto">
      <div className="text-center max-w-4xl mx-auto px-6 py-6 w-full">
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

        {/* Response Input Section - Show when question is asked */}
        {interviewPhase === "questions" && currentQuestion && !isSpeaking ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-2xl mx-auto px-4 z-10"
            data-response-input
          >
            <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
              <label className="block text-white text-sm font-medium mb-2">
                Your Answer:
              </label>
              
              <div className="space-y-3">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your answer here or use voice input..."
                  className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleSubmitResponse();
                    }
                  }}
                />

                {/* Voice Recognition Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleRecording}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isRecording
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{isRecording ? "Stop Recording" : "Start Voice Input"}</span>
                  </button>

                  {!recognition && (
                    <span className="text-xs text-gray-400">
                      Voice input not available (use Chrome/Edge)
                    </span>
                  )}
                </div>

                {/* Feedback Display */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-primary-900 bg-opacity-50 rounded-lg"
                  >
                    <p className="text-primary-200 text-sm">
                      <strong>Feedback:</strong> {feedback}
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!userResponse.trim()}
                    className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={askNextQuestion}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Skip Question
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Press Ctrl+Enter to submit, or click Submit Answer
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};
