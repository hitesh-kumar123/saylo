import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useInterviewStore } from "../../store/interviewStore";
import { JitsiVideo } from "./JitsiVideo";
import { LocalAIAgent } from "./LocalAIAgent";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Activity, Sparkles } from "lucide-react";
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
    if (currentSession) {
      await endInterview();
      navigate("/interview/feedback", {
        state: { interviewId: currentSession.id },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full max-w-7xl mx-auto p-4 lg:p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
        {/* Main Video Area */}
        <div className="lg:col-span-2 h-full flex flex-col gap-4">
          <div className="flex-grow relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
            {/* AI Agent View */}
            <div className="absolute inset-0">
              <LocalAIAgent
                onConnected={() => setIsConnected(true)}
                onQuestionAsked={(question) => {
                  console.log("Question asked:", question);
                }}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 pointer-events-none" />
            </div>

            {/* Status Indicators */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 backdrop-blur-md border ${isConnected ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                {isConnected ? 'AI Connected' : 'Connecting...'}
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <Sparkles size={12} className="text-primary-400" />
                GPT-4o Enabled
              </div>
            </div>

            {/* User Video (PIP) */}
            <motion.div 
              drag
              dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
              className="absolute bottom-6 right-6 w-48 sm:w-64 aspect-video rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-800 z-20 cursor-move group"
            >
              <JitsiVideo
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                onConnected={() => setIsConnected(true)}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                You
              </div>
            </motion.div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 glass rounded-2xl flex items-center justify-center gap-6 px-8 shadow-lg">
            <Button
              variant="outline"
              size="lg"
              className={`rounded-full w-14 h-14 p-0 flex items-center justify-center transition-all duration-300 ${
                isMuted 
                  ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20" 
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:scale-105"
              }`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={`rounded-full w-14 h-14 p-0 flex items-center justify-center transition-all duration-300 ${
                isVideoOff 
                  ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20" 
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:scale-105"
              }`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </Button>

            <div className="w-px h-8 bg-white/10 mx-2" />

            <Button
              variant="accent"
              size="lg"
              className="rounded-full px-8 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all hover:scale-105"
              onClick={handleEndInterview}
              isLoading={isLoading}
            >
              <PhoneOff size={20} className="mr-2" />
              End Session
            </Button>
          </div>
        </div>

        {/* Sidebar / Metrics */}
        <div className="glass rounded-2xl p-6 flex flex-col h-full overflow-hidden border border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-primary-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Live Analysis</h2>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
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

            <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <h3 className="text-sm font-medium text-primary-300 mb-3 flex items-center gap-2">
                <Sparkles size={14} />
                AI Coach Tips
              </h3>
              <ul className="space-y-3">
                {[
                  "Maintain eye contact with the camera",
                  "Speak clearly and at a moderate pace",
                  "Use the STAR method for behavioral questions",
                  "Keep answers concise and focused"
                ].map((tip, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
