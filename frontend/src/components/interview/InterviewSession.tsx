import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useInterviewStore } from "../../store/interviewStore";
import { Send, Clock, Mic, MicOff, Camera, CameraOff, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioVisualizer } from "./AudioVisualizer";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import AudioRecorder from "../AudioRecorder"; // Import Component
import { api } from "../../services/api"; // Import API

export const InterviewSession: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Proctoring State
  const [warningCount, setWarningCount] = useState(0);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const lastVideoTime = useRef(-1);
  const requestRef = useRef<number>();
  
  // Non-Verbal Metrics Refs
  const samplesCount = useRef(0);
  const lookingAwayCount = useRef(0);
  const totalHeadDelta = useRef(0);
  const lastHeadMatrix = useRef<number[] | null>(null);

  const webcamRef = useRef<Webcam>(null);

  const { 
    questions, 
    currentQuestionIndex, 
    submitAnswer,
    handleVoiceResponse,
    endInterview,
    config,
    sessionId // Destructure sessionId
  } = useInterviewStore();
  
  const currentQuestion = questions[currentQuestionIndex];

  const calculateMetrics = () => {
      const totalSamples = samplesCount.current || 1;
      const avgHeadMove = totalHeadDelta.current / totalSamples;
      const lookAwayRatio = lookingAwayCount.current / totalSamples;
      
      // Normalize to 1-10 scale basically
      // Look away: < 10% is good (10), > 50% is bad (1)
      const eyeContact = Math.max(1, 10 - (lookAwayRatio * 20)); 
      
      // Movement: Low is good (stable), High is nervous
      const nervousness = Math.min(10, avgHeadMove * 50); 
      
      return {
          eye_contact_score: Math.round(eyeContact * 10) / 10,
          posture_score: 8.5, // Placeholder as we don't track shoulders yet
          nervousness_score: Math.round(nervousness * 10) / 10,
          clarity_score: 8.0, // Placeholder
          confidence_score: 7.5
      };
  };

  // --- RE-IMPLEMENTED LOGIC START ---

  // 1. Timer Logic (Paused when submitting)
  useEffect(() => {
    if (isSubmitting || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
             // Timer hit 0
             return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitting, timeLeft]);

  // 2. Proctoring Setup (FaceLandmarker)
  useEffect(() => {
      const loadModel = async () => {
          try {
            const fileset = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            const landmarker = await FaceLandmarker.createFromOptions(fileset, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numFaces: 1
            });
            setFaceLandmarker(landmarker);
          } catch(err) {
              console.error("Failed to load proctoring model", err);
          }
      };
      loadModel();
  }, []);

  // 3. Detection Loop
  useEffect(() => {
      if (!faceLandmarker || !isCameraOn || !webcamRef.current?.video) return;

      const detect = () => {
          if (!webcamRef.current?.video || webcamRef.current.video.readyState !== 4) {
               requestRef.current = requestAnimationFrame(detect);
               return;
          }
          
          const startTimeMs = performance.now();
          if (lastVideoTime.current !== webcamRef.current.video.currentTime) {
              lastVideoTime.current = webcamRef.current.video.currentTime;
              const results = faceLandmarker.detectForVideo(webcamRef.current.video, startTimeMs);
              
              if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                  const landmarks = results.faceLandmarks[0];
                  // Nose tip is index 1
                  const noseTip = landmarks[1];
                  
                  // Simple bounds check for looking away
                  if (noseTip.x < 0.2 || noseTip.x > 0.8 || noseTip.y < 0.2 || noseTip.y > 0.8) {
                      setIsLookingAway(true);
                      lookingAwayCount.current += 1;
                      
                      // Identify continuous looking away for warning
                      // (Simplified for now)
                  } else {
                      setIsLookingAway(false);
                  }
                  
                  // Head movement calculation
                  if (lastHeadMatrix.current) {
                      const dx = noseTip.x - lastHeadMatrix.current[0];
                      const dy = noseTip.y - lastHeadMatrix.current[1];
                      totalHeadDelta.current += Math.sqrt(dx*dx + dy*dy);
                  }
                  lastHeadMatrix.current = [noseTip.x, noseTip.y];
              }
              samplesCount.current += 1;
          }
          requestRef.current = requestAnimationFrame(detect);
      };

      detect();
      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      }
  }, [faceLandmarker, isCameraOn]);
  
  // --- RE-IMPLEMENTED LOGIC END ---

  const handleAudioStop = async (audioBlob: Blob) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
        const metrics = calculateMetrics();
        const data = await api.sendAudioAnswer(sessionId || "", audioBlob, metrics);
        setAnswer("(Voice Answer Submitted)"); 
        
        // Use store handler instead of reload
        handleVoiceResponse(data);
        
    } catch (e: any) {
        console.error(e);
        const msg = e.response?.data?.detail || e.message || "Unknown error";
        alert("Voice submission failed: " + msg);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSubmit = async (auto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, auto ? 500 : 1500));
    
    const metrics = calculateMetrics();
    await submitAnswer(answer, metrics); 
    setIsSubmitting(false); // Important: submitAnswer doesn't fully reset component local state
  };
  
  const handleManualEnd = async () => {
      if (confirm("Are you sure you want to end the interview now?")) {
          setIsSubmitting(true);
          try {
              if (sessionId) {
                  await api.endInterview(sessionId);
                  endInterview(); // Switch store state to completed
              }
          } catch(e) {
              console.error(e);
              // meaningful error (but we can force end anyway)
              endInterview();
          } finally {
              setIsSubmitting(false);
          }
      }
  };

  // Helper for auto-submit
  const answerRef = React.useRef(answer);
  useEffect(() => { answerRef.current = answer; }, [answer]);
  
  useEffect(() => {
     if (timeLeft === 0) {
         submitAnswer(answerRef.current);
     }
  }, [timeLeft, submitAnswer]); 


  if (!currentQuestion) {
     return (
        <div className="flex items-center justify-center h-full">
           <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4 mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading Question...</p>
           </div>
        </div>
     );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6"
    >
        {/* Header Section */}
        <Card className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50">
             <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20"/>
                    AI Interview Configured
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {config.role} • {config.difficulty}
                </p>
             </div>

            <div className="flex items-center gap-6">
                 {/* End Interview Button */}
                 <button
                    onClick={handleManualEnd}
                    className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors border border-red-500/20"
                    title="End Interview"
                 >
                    <XCircle size={18} />
                    <span className="text-sm font-bold">End</span>
                 </button>

                 {/* Visualizer when speaking */}
                 <div className="hidden md:block w-32 h-10">
                     {stream && <AudioVisualizer stream={stream} isSpeaking={isMicOn} />}
                 </div>

                <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 20 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    <Clock size={20} />
                    {formatTime(timeLeft)}
                </div>
                
                {/* Warning Counter */}
                <div className="flex items-center gap-2 text-red-500 font-bold bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-full">
                    <AlertTriangle size={16} />
                    <span>{Math.floor(warningCount)}</span>
                </div>
            </div>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Left Column: Proctoring & Camera */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
             <Card className="p-2 bg-black overflow-hidden relative min-h-[240px] border-slate-800">
                {isCameraOn ? (
                    <>
                    <Webcam
                        ref={webcamRef}
                        audio={true}
                        muted={true}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        onUserMedia={(s) => setStream(s)}
                        className="w-full h-full object-cover rounded-lg transform scale-x-[-1]" 
                    />
                    <AnimatePresence>
                        {isLookingAway && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 border-4 border-red-500 rounded-lg flex items-center justify-center bg-red-500/10 pointer-events-none z-10"
                            >
                                <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce">
                                    <AlertTriangle size={20} fill="white" />
                                    Look at Screen!
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </>
                ) : (
                    <div className="h-64 flex items-center justify-center bg-slate-900 text-slate-500">
                        <CameraOff size={48} />
                    </div>
                )}
                
                {/* Overlay Controls */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button 
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`p-3 rounded-full ${isMicOn ? 'bg-white text-black' : 'bg-red-500 text-white'} transition-colors shadow-lg`}
                    >
                        {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button 
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        className={`p-3 rounded-full ${isCameraOn ? 'bg-white text-black' : 'bg-red-500 text-white'} transition-colors shadow-lg`}
                    >
                        {isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
                    </button>
                </div>
             </Card>

             {/* AI Agent Status / Visualizer */}
             <Card className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                 <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4 relative">
                     <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-ping"></div>
                     <span className="text-4xl">🤖</span>
                 </div>
                 <h3 className="font-bold text-slate-900 dark:text-white">AI Interviewer</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400">Listening to your answers...</p>
             </Card>
        </div>

        {/* Right Column: Q&A */}
        <div className="lg:col-span-2 flex flex-col gap-6 order-1 lg:order-2">
             <Card className="relative overflow-hidden border-l-4 border-l-primary-500">
                 <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-xs font-semibold text-primary-700 dark:text-primary-300 w-fit mb-4">
                     {currentQuestion.category}
                 </span>
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                     {currentQuestion.question}
                 </h2>
             </Card>

             <Card className="flex-grow flex flex-col p-0 overflow-hidden border-2 focus-within:border-primary-500 transition-colors shadow-md min-h-[300px]">
                 <textarea
                     className="flex-grow p-6 resize-none focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-base leading-relaxed"
                     placeholder="Speak your answer or type here..."
                     value={answer}
                     onChange={(e) => setAnswer(e.target.value)}
                     disabled={isSubmitting}
                     autoFocus
                     spellCheck={false}
                 />
                 <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                          {answer.length} characters
                      </span>
                      <div className="flex items-center gap-3">
                        <AudioRecorder 
                            onAudioStop={handleAudioStop} 
                            isProcessing={isSubmitting} 
                        />
                        <Button 
                         onClick={() => handleSubmit(false)} 
                         isLoading={isSubmitting}
                         disabled={!answer.trim() || isSubmitting}
                         rightIcon={<Send size={16} />}
                         className="px-8"
                     >
                         Submit Answer
                      </Button>
                      {isSubmitting && (
                          <p className="text-xs text-center text-indigo-500 animate-pulse mt-2">
                              AI is analyzing your answer... Please wait.
                          </p>
                      )}
                      </div>
                 </div>
             </Card>
        </div>
      </div>
    </motion.div>
  );
};
