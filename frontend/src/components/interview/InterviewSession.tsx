import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useInterviewStore } from "../../store/interviewStore";
import { Send, Clock, Mic, MicOff, Camera, CameraOff, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioVisualizer } from "./AudioVisualizer";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

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
  
  const webcamRef = useRef<Webcam>(null);

  const { 
    questions, 
    currentQuestionIndex, 
    submitAnswer,
    config
  } = useInterviewStore();
  
  const currentQuestion = questions[currentQuestionIndex];

  // Capture Audio Stream
  useEffect(() => {
    if (isMicOn) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(setStream)
        .catch(err => console.error("Mic Error:", err));
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    return () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isMicOn]);


  // Initialize MediaPipe FaceLandmarker
  useEffect(() => {
    const initMediaPipe = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      });
      setFaceLandmarker(landmarker);
    };
    initMediaPipe();
  }, []);

  // Predict Loop
  const predict = () => {
    if (webcamRef.current && webcamRef.current.video && isCameraOn && faceLandmarker) {
       const video = webcamRef.current.video;
       if (video.currentTime !== lastVideoTime.current) {
          lastVideoTime.current = video.currentTime;
          const result = faceLandmarker.detectForVideo(video, Date.now());
          
          if (result.faceBlendshapes && result.faceBlendshapes.length > 0 && result.faceBlendshapes[0].categories) {
             const shapes = result.faceBlendshapes[0].categories;
             // Simple "Look Away" detection using Yaw/Pitch proxy from blendshapes or landmarks
             // Using Eye Look In/Out/Up/Down blendshapes is more accurate for eyes
             const eyeLookInLeft = shapes.find(s => s.categoryName === 'eyeLookInLeft')?.score || 0;
             const eyeLookOutLeft = shapes.find(s => s.categoryName === 'eyeLookOutLeft')?.score || 0; 
             const eyeLookInRight = shapes.find(s => s.categoryName === 'eyeLookInRight')?.score || 0;
             const eyeLookOutRight = shapes.find(s => s.categoryName === 'eyeLookOutRight')?.score || 0;
             
             // If eyes are looking too far sideways
             const isLookingLeft = eyeLookInLeft > 0.5 || eyeLookOutRight > 0.5;
             const isLookingRight = eyeLookOutLeft > 0.5 || eyeLookInRight > 0.5;
             
             if (isLookingLeft || isLookingRight) {
                 setIsLookingAway(true);
                 // Throttle warning increment
                 setWarningCount(c => Math.min(c + 0.05, 5)); // Float to act as debounce
             } else {
                 setIsLookingAway(false);
             }
          }
       }
    }
    requestRef.current = requestAnimationFrame(predict);
  };

  useEffect(() => {
    if (isCameraOn && faceLandmarker) {
        requestRef.current = requestAnimationFrame(predict);
    } else {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isCameraOn, faceLandmarker]);


  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
             clearInterval(timer);
             handleAutoSubmit();
             return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex]); 

  // Reset state on new question
  useEffect(() => {
    setTimeLeft(90);
    setAnswer("");
    setIsSubmitting(false);
  }, [currentQuestionIndex]);

  const handleAutoSubmit = () => {
      handleSubmit(true); 
  };

  const handleSubmit = async (auto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (!auto) {
        await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    submitAnswer(answer); 
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
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
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
                      <Button 
                         onClick={() => handleSubmit(false)} 
                         isLoading={isSubmitting}
                         disabled={!answer.trim() || isSubmitting}
                         rightIcon={<Send size={16} />}
                         className="px-8"
                     >
                         Submit Answer
                      </Button>
                 </div>
             </Card>
        </div>
      </div>
    </motion.div>
  );
};
