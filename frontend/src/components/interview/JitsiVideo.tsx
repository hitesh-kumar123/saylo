import React, { useEffect, useRef, useState } from "react";
import { jitsiService } from "../../services/jitsiService";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";

interface JitsiVideoProps {
  isMuted: boolean;
  isVideoOff: boolean;
  roomName?: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onParticipantJoined?: (participant: any) => void;
  onParticipantLeft?: (participant: any) => void;
}

export const JitsiVideo: React.FC<JitsiVideoProps> = ({
  isMuted,
  isVideoOff,
  roomName,
  onConnected,
  onDisconnected,
  onParticipantJoined,
  onParticipantLeft,
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    const initializeVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Generate room name if not provided
        const finalRoomName = roomName || jitsiService.generateRoomName();

        // Get user info from localStorage or use defaults
        const userInfo = {
          displayName:
            localStorage.getItem("userName") || "Interview Candidate",
          email: localStorage.getItem("userEmail") || "",
        };

        // Join the room
        const api = await jitsiService.joinRoom(finalRoomName, userInfo);

        if (!mounted) return;

        // Set up event listeners
        api.addListener("videoConferenceJoined", () => {
          console.log("Joined video conference");
          setIsConnected(true);
          setIsLoading(false);
          if (onConnected) onConnected();
        });

        api.addListener("videoConferenceLeft", () => {
          console.log("Left video conference");
          setIsConnected(false);
          if (onDisconnected) onDisconnected();
        });

        api.addListener("participantJoined", (participant: any) => {
          console.log("Participant joined:", participant);
          setParticipants((prev) => [...prev, participant]);
          if (onParticipantJoined) onParticipantJoined(participant);
        });

        api.addListener("participantLeft", (participant: any) => {
          console.log("Participant left:", participant);
          setParticipants((prev) =>
            prev.filter((p) => p.id !== participant.id)
          );
          if (onParticipantLeft) onParticipantLeft(participant);
        });

        api.addListener("readyToClose", () => {
          console.log("Ready to close");
          setIsConnected(false);
          jitsiService.dispose();
        });
      } catch (err) {
        console.error("Error initializing Jitsi:", err);
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to initialize video"
          );
          setIsLoading(false);
        }
      }
    };

    initializeVideo();

    return () => {
      mounted = false;
      jitsiService.dispose();
    };
  }, [
    roomName,
    onConnected,
    onDisconnected,
    onParticipantJoined,
    onParticipantLeft,
  ]);

  // Handle audio/video state changes
  useEffect(() => {
    if (isConnected && jitsiService.isReady()) {
      if (jitsiService.isAudioMuted() !== isMuted) {
        jitsiService.toggleAudio();
      }
    }
  }, [isMuted, isConnected]);

  useEffect(() => {
    if (isConnected && jitsiService.isReady()) {
      if (jitsiService.isVideoMuted() !== isVideoOff) {
        jitsiService.toggleVideo();
      }
    }
  }, [isVideoOff, isConnected]);

  const handleLeaveRoom = () => {
    jitsiService.leaveRoom();
    setIsConnected(false);
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <VideoOff className="text-red-400 mb-4" size={48} />
          <p className="text-red-400 mb-2">Error connecting to video</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Connecting to video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Jitsi video container */}
      <div
        ref={videoContainerRef}
        id="jitsi-container"
        className="w-full h-full bg-gray-900"
      />

      {/* Connection status overlay */}
      {isConnected && (
        <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          Connected
        </div>
      )}

      {/* Participants count */}
      {participants.length > 0 && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {participants.length + 1} participant
          {participants.length > 0 ? "s" : ""}
        </div>
      )}

      {/* Video controls overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          onClick={() => jitsiService.toggleAudio()}
          className={`p-3 rounded-full ${
            isMuted
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={() => jitsiService.toggleVideo()}
          className={`p-3 rounded-full ${
            isVideoOff
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          title={isVideoOff ? "Turn on video" : "Turn off video"}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button
          onClick={handleLeaveRoom}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
          title="Leave room"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Screen sharing button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => jitsiService.toggleScreenShare()}
          className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600"
          title="Share screen"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v6h10V5H5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
