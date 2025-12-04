import React, { useEffect, useState } from "react";
import { TAVUS_CONFIG } from "../../config";

interface TavusAgentProps {
  onConnected?: () => void;
}

export const TavusAgent: React.FC<TavusAgentProps> = ({ onConnected }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, this would connect to the Tavus API
    // For demo purposes, we'll simulate the connection
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onConnected) onConnected();
    }, 3000);

    return () => clearTimeout(timer);

    // Real implementation would look something like this:
    /*
    const initTavus = async () => {
      try {
        setIsLoading(true);
        
        // Initialize Tavus CVI with the replica and persona
        const response = await fetch('https://api.tavus.io/v1/cvi/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TAVUS_CONFIG.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            replicaId: TAVUS_CONFIG.replicaId,
            personaId: TAVUS_CONFIG.personaId,
            mode: 'interview',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to initialize Tavus session');
        }
        
        const data = await response.json();
        
        // Initialize the CVI client
        // This would require the Tavus CVI client library
        
        setIsLoading(false);
        if (onConnected) onConnected();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to Tavus');
        setIsLoading(false);
      }
    };
    
    initTavus();
    */
  }, [onConnected]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400 mb-2">
            Error connecting to the AI interviewer
          </p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Connecting to AI interviewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800">
      {/* For the demo, we'll show a placeholder for the AI interviewer */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-40 h-40 rounded-full bg-gradient-to-r from-primary-700 to-secondary-700 mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">AI</span>
          </div>
          <div className="max-w-md mx-auto bg-gray-800 bg-opacity-70 p-4 rounded-lg">
            <p className="text-white text-lg">
              "Hello, I'm your AI interviewer today. I'll be asking you a series
              of questions to learn more about your experience and skills. Let's
              start with you telling me a bit about yourself."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
