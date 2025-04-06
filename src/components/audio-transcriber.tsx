import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Circle, RotateCw } from "lucide-react";
import { Editor } from "@tiptap/core";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AudioWave from "./audio-wave";

export default function AudioTranscriber({
  editor,
  showTranscriber = true,
}: {
  editor: Editor;
  showTranscriber?: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPosRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startRecording = async () => {
    try {
      setRecordingTime(0);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Microphone access error:", error);
      toast.error(
        "Could not access microphone. Please ensure you have granted permission.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setStream(null);
    }
  };

  const cancelTranscription = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsTranscribing(false);
    }
  };

  const handleRecordingStop = async () => {
    try {
      setIsTranscribing(true);

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioFile);

      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`,
        );
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });

        editor.chain().focus().insertContent(textChunk).run();
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.info("Transcription canceled");
      } else {
        console.error("Error processing recording:", error);
        toast.error("Error processing recording. Please try again.");
      }
    } finally {
      setIsTranscribing(false);
      lastPosRef.current = null;
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (!showTranscriber) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background shadow-2xs z-50 rounded-3xl border px-1 py-0.5 transition-opacity duration-300 ease-in-out",
        showTranscriber ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!showTranscriber}
    >
      <div className="flex items-center justify-between space-x-2 p-1">
        <div className="flex items-center justify-start space-x-2">
          <Button
            variant="outline"
            size="xs"
            className="size-8 rounded-full"
            onClick={startRecording}
            disabled={isTranscribing || isRecording}
          >
            {isRecording ? (
              <Circle
                className="size-4 animate-pulse"
                fill="red"
                stroke="red"
              />
            ) : (
              <Mic className="size-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="xs"
            className="size-8 rounded-full"
            onClick={isRecording ? stopRecording : cancelTranscription}
            disabled={
              (isRecording && isTranscribing) ||
              (!isRecording && !isTranscribing)
            }
          >
            <Square className="size-4" />
          </Button>
        </div>

        <AudioWave stream={stream} isRecording />

        <div className="flex items-center justify-end space-x-2">
          <span className="animate-in text-sm font-medium">
            {formatTime(recordingTime)}
          </span>
          {isTranscribing && (
            <RotateCw className="size-3.5 animate-spin cursor-pointer rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}
