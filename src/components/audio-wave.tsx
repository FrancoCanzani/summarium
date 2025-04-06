"use client";

import { useEffect, useRef } from "react";

interface AudioWaveProps {
  stream: MediaStream | null;
  isRecording: boolean;
  color?: string;
  sensitivity?: number;
  smoothing?: number;
}

export default function AudioWave({
  stream,
  isRecording,
  color = "#e0e6f0",
  sensitivity = 2.5,
  smoothing = 0.9,
}: AudioWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousDataRef = useRef<Uint8Array | null>(null);

  const initializeAudioWave = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    // Higher resolution for smoother visualization
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = smoothing;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const previousData = new Uint8Array(bufferLength);
    previousData.fill(128);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    previousDataRef.current = previousData;
    audioContextRef.current = audioContext;

    drawAudioWave();
  };

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Initialize canvas even if there's no stream
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }

    if (isRecording && stream) {
      initializeAudioWave(stream);
    } else {
      drawStaticLine();
    }

    return () => {
      stopAudioWave();
    };
  }, [isRecording, stream, color, sensitivity, smoothing]);

  const drawAudioWave = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const previousData = previousDataRef.current;

    if (!canvas || !analyser || !dataArray || !previousData) return;

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    // Make canvas responsive
    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas with subtle gradient background
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply smoothing between frames
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = dataArray[i] * 0.7 + previousData[i] * 0.3;
        previousData[i] = dataArray[i];
      }

      // Draw wave with enhanced styling
      canvasCtx.lineWidth = 2;

      // Create gradient for the line
      const lineGradient = canvasCtx.createLinearGradient(
        0,
        canvas.height / 2 - 20,
        0,
        canvas.height / 2 + 20,
      );
      lineGradient.addColorStop(0, `${color}80`); // Semi-transparent
      lineGradient.addColorStop(0.5, color);
      lineGradient.addColorStop(1, `${color}80`); // Semi-transparent

      canvasCtx.strokeStyle = lineGradient;

      // Add glow effect
      canvasCtx.shadowColor = color;
      canvasCtx.shadowBlur = 8;
      canvasCtx.shadowOffsetY = 0;

      canvasCtx.beginPath();

      // Only draw a subset of points for performance
      const skipPoints = Math.max(1, Math.floor(dataArray.length / 250));
      const sliceWidth = (canvas.width * 1.2) / (dataArray.length / skipPoints);

      let x = 0;
      for (let i = 0; i < dataArray.length; i += skipPoints) {
        const v = dataArray[i] / 128.0 - 1;
        const y = canvas.height / 2 + ((v * canvas.height) / 2) * sensitivity;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          // Use quadratic curves for smoother lines
          const prevX = x - sliceWidth;
          const prevY =
            (dataArray[i - skipPoints] / 128.0 - 1) *
              ((canvas.height / 2) * sensitivity) +
            canvas.height / 2;

          canvasCtx.quadraticCurveTo(prevX + sliceWidth / 2, prevY, x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.stroke();

      // Reset shadow settings
      canvasCtx.shadowBlur = 0;
      canvasCtx.shadowOffsetY = 0;
    };

    draw();

    return () => {
      resizeObserver.disconnect();
    };
  };

  const stopAudioWave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const drawStaticLine = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    // Make sure canvas is sized correctly
    if (canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }

    // Clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a static line in the middle
    const y = canvas.height / 2;

    canvasCtx.beginPath();
    canvasCtx.moveTo(0, y);
    canvasCtx.lineTo(canvas.width, y);

    // Style the line
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = color;

    // Add subtle glow
    canvasCtx.shadowColor = color;
    canvasCtx.shadowBlur = 4;
    canvasCtx.shadowOffsetY = 0;

    canvasCtx.stroke();

    // Reset shadow
    canvasCtx.shadowBlur = 0;

    // Set up resize observer to redraw the line when container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        // Redraw the line after resize
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, canvas.height / 2);
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = color;
        canvasCtx.shadowColor = color;
        canvasCtx.shadowBlur = 4;
        canvasCtx.stroke();
        canvasCtx.shadowBlur = 0;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Store the observer reference so we can disconnect it later
    return () => {
      resizeObserver.disconnect();
    };
  };

  return <canvas ref={canvasRef} className="h-4 w-32" />;
}
