import React, { useEffect, useRef } from 'react';

export default function JitsiMeeting({ roomName, displayName, onClose }) {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const domain = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si';

    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = `https://${domain}/external_api.js`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initJitsi = async () => {
      try {
        await loadJitsiScript();

        if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
          const api = new window.JitsiMeetExternalAPI(domain, {
            roomName: roomName || `saylo-interview-${Date.now()}`,
            parentNode: jitsiContainerRef.current,
            userInfo: {
              displayName: displayName || 'Candidate',
            },
            configOverwrite: {
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              disableModeratorIndicator: true,
              enableEmailInStats: false,
              prejoinPageEnabled: false,
            },
            interfaceConfigOverwrite: {
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'desktop', 'chat',
                'raisehand', 'tileview', 'hangup'
              ],
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_REMOTE_DISPLAY_NAME: 'Interviewer',
            },
          });

          apiRef.current = api;

          api.addEventListener('readyToClose', () => {
            if (onClose) onClose();
          });
        }
      } catch (error) {
        console.error('Failed to load Jitsi:', error);
      }
    };

    initJitsi();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName, displayName, onClose]);

  return (
    <div
      ref={jitsiContainerRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}
