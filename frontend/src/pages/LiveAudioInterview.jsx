import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, ChevronLeft, Volume2, Bot, Loader2, Play } from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';

export default function LiveAudioInterview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // App States: 'idle' | 'starting' | 'listening' | 'thinking' | 'speaking' | 'completed'
  const [appState, setAppState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [aiText, setAiText] = useState('');
  const [isEnding, setIsEnding] = useState(false);

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const currentUtteranceRef = useRef(null);
  const latestTranscriptRef = useRef('');

  // Initialization & First Question
  useEffect(() => {
    const initSpeechRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
        navigate(`/interview/${id}`); // Fallback to text
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setAppState('listening');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Update refs and state
        const updatedTranscript = latestTranscriptRef.current + finalTranscript + interimTranscript;
        setTranscript(updatedTranscript);
        
        if (finalTranscript) {
           latestTranscriptRef.current += finalTranscript + ' ';
           setTranscript(latestTranscriptRef.current);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'no-speech') {
            // Ignore no speech, it will just end and we can restart or wait
        } else {
            stopListening();
            setAppState('idle');
        }
      };

      recognition.onend = () => {
        // When user stops speaking or pause happens, if we have transcript, send it
        const finalAns = latestTranscriptRef.current.trim();
        if (appState === 'listening' && finalAns.length > 5) {
            handleSendAnswer(finalAns);
        } else {
            // If empty, just go to idle or restart listening based on state
            if (appState === 'listening') {
                setAppState('idle');
            }
        }
      };

      recognitionRef.current = recognition;
    };

    initSpeechRecognition();

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, [id, navigate]);

  const speakText = useCallback((text, onEndCallback) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel(); // stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English voice (preferably female/natural)
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang === 'en-US');
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setAppState('speaking');
    utterance.onend = () => {
      setAppState('idle');
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      setAppState('idle');
      if (onEndCallback) onEndCallback();
    };

    currentUtteranceRef.current = utterance;
    synthesisRef.current.speak(utterance);
    setAiText(text);
  }, []);

  // Handle first question
  const startSession = () => {
    setAppState('starting');
    const firstQuestion = sessionStorage.getItem(`saylo_first_q_${id}`) || "Welcome! Let's begin your interview. Tell me about yourself and why you're applying for this role.";
    sessionStorage.removeItem(`saylo_first_q_${id}`);
    
    speakText(firstQuestion, () => {
       startListening();
    });
  };

  const startListening = () => {
    if (recognitionRef.current && appState !== 'completed') {
      latestTranscriptRef.current = '';
      setTranscript('');
      try {
        recognitionRef.current.start();
        setAppState('listening');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSendAnswer = async (userText) => {
    stopListening();
    setAppState('thinking');
    
    try {
      const res = await api.sendAnswer({ session_id: id, answer: userText });

      if (res.is_completed) {
        setAppState('completed');
        const finalText = res.feedback ? `${res.feedback}. The interview is now complete.` : "The interview is now complete.";
        speakText(finalText, () => {
           navigate(`/interview/${id}/results`, {
             state: { feedback: res.final_feedback_data, sessionId: id }
           });
        });
      } else {
        const textToSpeak = res.feedback ? `${res.feedback} ... ${res.next_question}` : res.next_question;
        speakText(textToSpeak, () => {
           // Auto start listening after AI finishes speaking
           startListening();
        });
      }
    } catch (err) {
      console.error(err);
      speakText("I'm sorry, I encountered an error. Could you repeat that?", () => {
         startListening();
      });
    }
  };

  const handleEnd = async () => {
    setIsEnding(true);
    stopListening();
    synthesisRef.current.cancel();
    try {
      const res = await api.endInterview({ session_id: id });
      setAppState('completed');
      speakText("Interview ended. Generating your results...", () => {
        navigate(`/interview/${id}/results`, {
          state: { feedback: res.final_feedback_data, sessionId: id }
        });
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnding(false);
    }
  };

  // UI Helpers
  const renderVisualizer = () => {
    if (appState === 'idle' || appState === 'starting') {
        return (
            <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-48 h-48 rounded-full bg-paper border border-ink/10 flex items-center justify-center shadow-lg cursor-pointer hover:bg-cream transition-colors"
                onClick={appState === 'idle' && transcript === '' ? startSession : undefined}
            >
                {appState === 'idle' && transcript === '' ? (
                   <div className="flex flex-col items-center text-ink/50">
                       <Play className="w-10 h-10 mb-2 fill-current" />
                       <span className="font-bold text-xs uppercase tracking-widest">Start Interview</span>
                   </div>
                ) : (
                    <Bot className="w-16 h-16 text-ink/20" />
                )}
            </motion.div>
        );
    }

    if (appState === 'speaking') {
        return (
            <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-sayloAccent rounded-full blur-2xl"
                />
                <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="relative w-32 h-32 bg-ink rounded-full flex items-center justify-center shadow-2xl"
                >
                    <Volume2 className="w-12 h-12 text-paper" />
                </motion.div>
            </div>
        );
    }

    if (appState === 'listening') {
        return (
            <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer" onClick={stopListening}>
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-green-500 rounded-full blur-xl"
                />
                 <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
                    className="absolute inset-0 bg-green-400 rounded-full blur-md"
                />
                <div className="relative w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Mic className="w-12 h-12 text-white animate-pulse" />
                </div>
            </div>
        );
    }

    if (appState === 'thinking') {
        return (
            <div className="relative w-48 h-48 flex items-center justify-center">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute w-40 h-40 border-4 border-dashed border-ink/20 rounded-full"
                />
                <div className="w-24 h-24 bg-paper border border-ink/10 rounded-full flex items-center justify-center shadow-inner">
                    <Loader2 className="w-8 h-8 text-ink animate-spin" />
                </div>
            </div>
        );
    }

    if (appState === 'completed') {
        return (
            <div className="w-48 h-48 rounded-full bg-paper border border-ink/10 flex items-center justify-center shadow-lg">
                <Square className="w-12 h-12 text-ink" />
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-paper text-ink overflow-hidden font-sans relative">
      {/* Top Bar */}
      <header className="h-16 border-b border-ink/10 bg-cream flex items-center justify-between px-6 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-ink/5 rounded-sm text-ink/60 hover:text-ink transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display tracking-wide text-xl">Voice Interview</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mt-0.5">
              <span className={cn(
                  "px-1.5 py-0.5 border flex items-center gap-1",
                  appState === 'listening' ? "bg-green-100 text-green-700 border-green-200" : "bg-ink/5 text-ink border-ink/10"
              )}>
                {appState === 'listening' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                {appState === 'speaking' && <span className="w-1.5 h-1.5 bg-sayloAccent rounded-full animate-pulse" />}
                {appState.toUpperCase()}
              </span>
              <span>Session #{id?.substring(0, 6)}</span>
            </div>
          </div>
        </div>

        <button
            onClick={handleEnd}
            disabled={isEnding || appState === 'completed'}
            className="px-5 py-2.5 rounded-sm bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest transition-all flex items-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEnding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
            End Interview
          </button>
      </header>

      {/* Main Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full relative z-10">
         
         <div className="mb-16">
             {renderVisualizer()}
         </div>

         {/* Subtitles / Text Display */}
         <div className="w-full max-w-2xl text-center min-h-[120px] px-8 py-6 rounded-sm bg-cream/50 border border-ink/5 backdrop-blur-sm shadow-sm">
             <AnimatePresence mode="wait">
                 {appState === 'speaking' && (
                     <motion.div
                        key="ai-text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                     >
                         <p className="text-xs font-bold text-sayloAccent uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                             <Bot className="w-4 h-4" /> AI is speaking
                         </p>
                         <p className="font-display text-2xl leading-relaxed text-ink">{aiText}</p>
                     </motion.div>
                 )}

                 {appState === 'listening' && (
                     <motion.div
                        key="user-text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                     >
                         <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                             <Mic className="w-4 h-4" /> Listening...
                         </p>
                         <p className="text-lg leading-relaxed font-medium text-ink/80">
                             {transcript || <span className="text-ink/30 italic">Start speaking... (will auto-submit when you pause)</span>}
                         </p>
                     </motion.div>
                 )}

                 {appState === 'thinking' && (
                      <motion.div
                        key="thinking-text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center justify-center h-full pt-4"
                     >
                         <Loader2 className="w-6 h-6 text-ink/40 animate-spin mb-3" />
                         <p className="text-xs font-bold text-muted uppercase tracking-widest">Processing your answer...</p>
                     </motion.div>
                 )}

                 {(appState === 'idle' || appState === 'starting') && transcript === '' && (
                     <motion.div
                        key="idle-text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center justify-center h-full pt-4"
                     >
                         <p className="font-display text-2xl text-ink mb-2">Ready when you are.</p>
                         <p className="text-xs font-bold text-muted uppercase tracking-widest">Click the play button above to start</p>
                     </motion.div>
                 )}
             </AnimatePresence>
         </div>

      </div>

      {/* Manual Override Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
          <div className="bg-cream border border-ink/10 rounded-sm p-2 flex items-center gap-2 shadow-lg">
              <button 
                  onClick={startListening} 
                  disabled={appState === 'listening' || appState === 'speaking' || appState === 'thinking' || appState === 'idle' && transcript === ''}
                  className="p-3 rounded-sm hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-ink"
                  title="Force Listen"
              >
                  <Mic className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-ink/10"></div>
              <button 
                  onClick={() => {
                      if (appState === 'listening') {
                          handleSendAnswer(latestTranscriptRef.current);
                      }
                  }} 
                  disabled={appState !== 'listening'}
                  className="px-6 py-3 rounded-sm bg-ink text-paper hover:bg-ink/90 disabled:opacity-30 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
              >
                  Submit Answer Early
              </button>
          </div>
      </div>

      {/* Ambient background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sayloAccent rounded-full blur-[100px] opacity-5 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500 rounded-full blur-[100px] opacity-5 pointer-events-none" />
    </div>
  );
}
