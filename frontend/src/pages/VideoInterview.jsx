import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, VideoOff, ChevronLeft, PhoneOff } from 'lucide-react';
import JitsiMeeting from '../components/JitsiMeeting';

export default function VideoInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    navigate(`/interview/${id}/results`);
  };

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-dark-card flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">Video Interview</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                {isCallActive ? 'Live' : 'Ready'}
              </span>
              <span className="text-slate-500">Session #{id?.substring(0, 6)}</span>
            </div>
          </div>
        </div>

        {isCallActive && (
          <button
            onClick={handleEndCall}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
          >
            <PhoneOff className="w-4 h-4" />
            End Interview
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {isCallActive ? (
          <div className="w-full h-full max-w-6xl">
            <JitsiMeeting
              roomName={`saylo-interview-${id}`}
              displayName="Candidate"
              onClose={handleEndCall}
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Ready to Join?</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              You'll be connected to a video room for your interview session.
              Make sure your camera and microphone are working before joining.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleStartCall}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Join Video Interview
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
              >
                Cancel
              </button>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Before you join:</h4>
              <ul className="text-xs text-slate-400 space-y-1 text-left">
                <li>• Ensure a stable internet connection</li>
                <li>• Test your microphone and camera</li>
                <li>• Find a quiet, well-lit space</li>
                <li>• Close unnecessary browser tabs</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
