import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Send, ChevronLeft, Mic, MicOff, Square, Bot, User, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(1800);

  // Load first question from session storage (set during InterviewSetup)
  useEffect(() => {
    const firstQuestion = sessionStorage.getItem(`saylo_first_q_${id}`);
    if (firstQuestion) {
      setMessages([{ role: 'ai', content: firstQuestion }]);
      sessionStorage.removeItem(`saylo_first_q_${id}`);
    } else {
      setMessages([{
        role: 'ai',
        content: "Welcome! Let's begin your interview. Tell me about yourself and why you're applying for this role."
      }]);
    }
  }, [id]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const appendMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleSend = async () => {
    if (!answer.trim() || isSending || isCompleted) return;

    const userText = answer.trim();
    setAnswer('');
    appendMessage('user', userText);
    setIsSending(true);

    try {
      const res = await api.sendAnswer({ session_id: id, answer: userText });

      if (res.is_completed) {
        setIsCompleted(true);
        appendMessage('ai', res.feedback);
        setTimeout(() => {
          navigate(`/interview/${id}/results`, {
            state: { feedback: res.final_feedback_data, sessionId: id }
          });
        }, 2500);
      } else {
        if (res.feedback) appendMessage('ai', `📊 ${res.feedback}`);
        if (res.next_question) appendMessage('ai', res.next_question);
      }
    } catch (err) {
      appendMessage('ai', '⚠️ Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleEnd = async () => {
    if (isEnding || isCompleted) return;
    setIsEnding(true);
    try {
      const res = await api.endInterview({ session_id: id });
      setIsCompleted(true);
      appendMessage('ai', '🏁 Interview ended. Generating your results...');
      setTimeout(() => {
        navigate(`/interview/${id}/results`, {
          state: { feedback: res.final_feedback_data, sessionId: id }
        });
      }, 2000);
    } catch (err) {
      appendMessage('ai', '⚠️ Could not end the session. Please try again.');
    } finally {
      setIsEnding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudio(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      appendMessage('ai', '⚠️ Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudio = async (blob) => {
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('session_id', id);
    formData.append('audio_file', blob, 'recording.webm');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/interview/audio-chat`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();

      if (data.is_completed) {
        setIsCompleted(true);
        appendMessage('ai', data.feedback);
        setTimeout(() => {
          navigate(`/interview/${id}/results`, {
            state: { feedback: data.final_feedback_data, sessionId: id }
          });
        }, 2500);
      } else {
        if (data.feedback) appendMessage('ai', `📊 ${data.feedback}`);
        if (data.next_question) appendMessage('ai', data.next_question);
      }
    } catch {
      appendMessage('ai', '⚠️ Audio transcription failed. Please type your answer.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-paper text-ink overflow-hidden font-sans">
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
            <h1 className="font-display tracking-wide text-xl">Live Interview</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mt-0.5">
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 border border-green-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
              <span>Session #{id?.substring(0, 6)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono text-lg font-medium ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-ink'}`}>
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={handleEnd}
            disabled={isEnding || isCompleted}
            className="px-5 py-2.5 rounded-sm bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest transition-all flex items-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEnding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
            End Interview
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 max-w-4xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai'
                  ? 'bg-ink border border-ink text-paper'
                  : 'bg-cream border border-ink/10 text-ink'
              }`}>
                {msg.role === 'ai'
                  ? <Bot className="w-4 h-4" />
                  : <User className="w-4 h-4" />
                }
              </div>

              {/* Bubble */}
              <div className={`px-5 py-3.5 text-sm leading-relaxed max-w-[85%] rounded-sm ${
                msg.role === 'ai'
                  ? 'bg-white border border-ink/10 text-ink shadow-sm'
                  : 'bg-ink border border-ink text-paper shadow-sm'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {(isSending || isTranscribing) && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 max-w-3xl"
            >
              <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-paper" />
              </div>
              <div className="px-5 py-3.5 rounded-sm bg-white border border-ink/10 shadow-sm">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-2 h-2 bg-ink/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-ink/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-ink/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-ink/10 bg-cream p-4">
        <div className={`flex items-end gap-3 max-w-4xl mx-auto transition-opacity ${isCompleted ? 'opacity-40 pointer-events-none' : ''}`}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 bg-white border border-ink/10 rounded-sm px-4 py-3 text-sm text-ink placeholder-ink/40 focus:outline-none focus:border-ink resize-none shadow-sm transition-colors"
          />

          {/* Mic button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            title="Hold to record"
            className={`p-3.5 rounded-sm border transition-all ${
              isRecording
                ? 'bg-red-600 border-red-600 text-white animate-pulse shadow-sm'
                : 'bg-white border-ink/10 text-ink/60 hover:text-ink hover:border-ink/30 shadow-sm'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!answer.trim() || isSending || isCompleted}
            className="p-3.5 rounded-sm bg-ink hover:bg-ink/90 text-paper transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        <p className="text-center text-[10px] uppercase tracking-widest font-bold text-muted mt-3">
          {isRecording ? '🔴 Recording… release to send' : 'Hold mic to record · Enter to send'}
        </p>
      </div>
    </div>
  );
}
