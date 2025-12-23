import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onAudioStop: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioStop, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted.");
      
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") 
        ? "audio/webm;codecs=opus" 
        : "audio/webm";
      
      console.log(`Using MimeType: ${mimeType}`);

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("Audio chunk received:", event.data.size);
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("Recording stopped. Total chunks:", chunksRef.current.length);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log("Audio Blob created, size:", audioBlob.size);
        if (audioBlob.size > 0) {
            onAudioStop(audioBlob);
        } else {
            alert("No audio recorded. Please check your microphone settings.");
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied or error starting recorder. Check console.");
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isProcessing ? (
        <button disabled className="p-3 rounded-full bg-gray-700/50 cursor-not-allowed">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </button>
      ) : !isRecording ? (
        <button
          onClick={startRecording}
          className="p-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all"
          title="Start Voice Answer"
        >
          <Mic className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="p-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all animate-pulse"
          title="Stop Recording"
        >
          <Square className="w-5 h-5 fill-current" />
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
