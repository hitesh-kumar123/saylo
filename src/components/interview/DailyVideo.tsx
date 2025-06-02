import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Video, VideoOff } from 'lucide-react';

interface DailyVideoProps {
  isMuted: boolean;
  isVideoOff: boolean;
}

export const DailyVideo: React.FC<DailyVideoProps> = ({ isMuted, isVideoOff }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would get this URL from your backend
    const roomUrl = 'https://your-domain.daily.co/your-room';
    
    // Initialize Daily
    if (videoContainerRef.current && !callFrame) {
      setIsLoading(true);
      
      // In a real implementation, this would be a valid Daily room
      // For demo purposes, we'll just simulate the connection
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      // The actual Daily implementation would look like this:
      /*
      const daily = DailyIframe.createFrame(videoContainerRef.current, {
        isMobileLayout: true,
        showLeaveButton: false,
        showFullscreenButton: false,
      });
      
      daily.join({ url: roomUrl });
      setCallFrame(daily);
      
      daily.on('joined-meeting', () => {
        setIsLoading(false);
      });
      
      return () => {
        daily.destroy();
      };
      */
    }
  }, [callFrame]);
  
  useEffect(() => {
    if (callFrame) {
      callFrame.setLocalAudio(!isMuted);
    }
  }, [callFrame, isMuted]);
  
  useEffect(() => {
    if (callFrame) {
      callFrame.setLocalVideo(!isVideoOff);
    }
  }, [callFrame, isVideoOff]);

  return (
    <div ref={videoContainerRef} className="w-full h-full relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-pulse text-white">Connecting...</div>
        </div>
      ) : isVideoOff ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <VideoOff className="text-gray-400" size={24} />
        </div>
      ) : (
        // For demo purposes, show a placeholder instead of actual video
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
          <div className="rounded-full bg-gray-600 h-20 w-20 flex items-center justify-center">
            <span className="text-white text-xl font-semibold">You</span>
          </div>
        </div>
      )}
    </div>
  );
};