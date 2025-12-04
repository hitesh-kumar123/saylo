import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useInterviewStore } from "../../store/interviewStore";
import { JitsiVideo } from "./JitsiVideo";
import { EnhancedAIAgent } from "./EnhancedAIAgent";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";

export const InterviewSession: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { currentSession, endInterview, isLoading } = useInterviewStore();
  const navigate = useNavigate();

  // Demo data for the emotion timeline
  const [emotions, setEmotions] = useState<
    { timestamp: number; emotion: string; intensity: number }[]
  >([]);
  const emotionInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isConnected && !emotionInterval.current) {
      // Simulate emotion detection with random data
      emotionInterval.current = setInterval(() => {
        const possibleEmotions = [
          "neutral",
          "confident",
          "nervous",
          "confused",
          "engaged",
        ];
        const randomEmotion =
          possibleEmotions[Math.floor(Math.random() * possibleEmotions.length)];
        const newEmotionPoint = {
          timestamp: Date.now(),
          emotion: randomEmotion,
          intensity: Math.random() * 0.5 + 0.5, // Value between 0.5 and 1.0
        };

        setEmotions((prev) => [...prev, newEmotionPoint]);
      }, 3000);
    }

    return () => {
      if (emotionInterval.current) {
        clearInterval(emotionInterval.current);
      }
    };
  }, [isConnected]);

  const handleEndInterview = async () => {
    await endInterview();
    navigate("/interview/feedback");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 h-full flex flex-col">
          <div className="flex-grow bg-gray-900 rounded-lg overflow-hidden relative">
            {/* The AI interviewer video */}
            <div className="absolute inset-0">
              <EnhancedAIAgent
                onConnected={() => setIsConnected(true)}
                userContext={{
                  role: "Software Developer",
                  experience: "Mid-level",
                  skills: ["JavaScript", "React", "Node.js", "TypeScript"],
                }}
              />
            </div>

            {/* User's video (smaller overlay) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
              <JitsiVideo
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                onConnected={() => setIsConnected(true)}
              />
            </div>
          </div>

          {/* Video controls */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              className={`rounded-full p-3 ${
                isMuted ? "bg-red-100 text-red-600" : ""
              }`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={`rounded-full p-3 ${
                isVideoOff ? "bg-red-100 text-red-600" : ""
              }`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </Button>

            <Button
              variant="accent"
              size="lg"
              className="rounded-full p-3 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleEndInterview}
              isLoading={isLoading}
            >
              <PhoneOff size={20} />
            </Button>
          </div>
        </div>

        {/* Real-time performance metrics */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>

          <PerformanceMetrics
            metrics={{
              eyeContact: 0.75,
              confidence: 0.65,
              clarity: 0.82,
              enthusiasm: 0.7,
              posture: 0.6,
            }}
            emotionTimeline={emotions}
          />

          <div className="mt-4 p-3 bg-primary-50 rounded-md">
            <h3 className="text-sm font-medium text-primary-800 mb-2">
              Interview Tips:
            </h3>
            <ul className="text-xs text-primary-700 space-y-1">
              <li>• Maintain eye contact with the camera</li>
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Use the STAR method for behavioral questions</li>
              <li>• Keep answers concise and focused</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
