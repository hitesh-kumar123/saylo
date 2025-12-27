import React, { useEffect, useRef } from "react";

export const AudioVisualizer: React.FC<{
  stream: MediaStream | null;
  isSpeaking: boolean;
}> = ({ stream, isSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const sourceRef = useRef<MediaStreamAudioSourceNode>();

  useEffect(() => {
    if (!stream || !canvasRef.current || stream.getAudioTracks().length === 0) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgb(15, 23, 42)"; // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = isSpeaking 
            ? `rgb(${r},${g},${b})` 
            : `rgb(50, 50, 50)`; // Dim when not speaking (or logic based on volume)
        
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContext.state !== "closed") audioContext.close();
    };
  }, [stream, isSpeaking]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 rounded-lg border border-slate-700 bg-slate-900"
      width={300}
      height={100}
    />
  );
};
