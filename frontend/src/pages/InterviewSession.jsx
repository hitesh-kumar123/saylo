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
    <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-dark-card flex items-center justify-between px-6 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">Live Interview</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Live
              </span>
              <span className="text-slate-500">Session #{id?.substring(0, 6)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono text-lg font-medium ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={handleEnd}
            disabled={isEnding || isCompleted}
            className="px-5 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold transition-all flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEnding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
            End Interview
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai'
                  ? 'bg-primary-500/20 border border-primary-500/30'
                  : 'bg-white/10 border border-white/10'
              }`}>
                {msg.role === 'ai'
                  ? <Bot className="w-4 h-4 text-primary-400" />
                  : <User className="w-4 h-4 text-slate-300" />
                }
              </div>

              {/* Bubble */}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[75%] ${
                msg.role === 'ai'
                  ? 'bg-white/[0.06] border border-white/[0.07] text-slate-200 rounded-tl-sm'
                  : 'bg-primary-600/30 border border-primary-500/20 text-white rounded-tr-sm'
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
              <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/[0.07]">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-white/5 bg-dark-card p-4">
        <div className={`flex items-end gap-3 max-w-4xl mx-auto transition-opacity ${isCompleted ? 'opacity-40 pointer-events-none' : ''}`}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 resize-none"
          />

          {/* Mic button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            title="Hold to record"
            className={`p-3 rounded-xl border transition-all ${
              isRecording
                ? 'bg-red-500 border-red-400 text-white animate-pulse'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!answer.trim() || isSending || isCompleted}
            className="p-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white border border-primary-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-2">
          {isRecording ? '🔴 Recording… release to send' : 'Hold mic to record · Enter to send'}
        </p>
      </div>
    </div>
  );
}
