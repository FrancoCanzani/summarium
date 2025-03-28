import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Mic, Square, Circle, StickyNote, RotateCw } from "lucide-react";
import AudioWave from "./audio-wave";
import { Editor } from "@tiptap/core";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AudioTranscriber({
  editor,
  showTranscriber,
}: {
  editor: Editor;
  showTranscriber: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      setTranscript("");
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
    } catch {
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

  const handleRecordingStop = async () => {
    try {
      setIsTranscribing(true);
      setTranscript("");

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const reader = response.body?.getReader();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setTranscript((prev) => prev + new TextDecoder().decode(value));
        }
      }
    } catch {
      toast.error("Error processing recording. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  return (
    <div
      className={cn(
        "bg-background z-50 hidden w-80 space-y-2 rounded-md border p-2 opacity-0 transition-all duration-300",
        showTranscriber && "block opacity-100",
      )}
    >
      <h6 className="text-sm font-medium capitalize text-gray-600">
        Speech to text
      </h6>
      {transcript ? (
        <div className="max-h-36 overflow-scroll rounded-sm border bg-gray-50 p-1 text-xs text-gray-700">
          <p>{transcript}</p>
        </div>
      ) : (
        <AudioWave stream={stream} isRecording={isRecording} />
      )}

      <div className="flex items-center justify-between space-x-2 p-1">
        <div className="flex items-center justify-start space-x-2">
          <Button
            variant="outline"
            size="xs"
            className="cursor-pointer rounded-sm text-gray-500"
            onClick={startRecording}
            disabled={isTranscribing || isRecording}
          >
            {isRecording ? (
              <Circle
                className="size-3.5 animate-pulse"
                fill="red"
                stroke="red"
              />
            ) : (
              <Mic className="size-3.5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="xs"
            className="cursor-pointer rounded-sm text-gray-500"
            onClick={stopRecording}
            disabled={!isRecording || isTranscribing}
          >
            <Square className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            className="cursor-pointer rounded-sm text-gray-500"
            onClick={() => editor.commands.insertContent(`\n${transcript}`)}
            disabled={isRecording || isTranscribing}
          >
            <StickyNote className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            className="cursor-pointer rounded-sm text-gray-500"
            onClick={stopRecording}
            disabled={isRecording || isTranscribing}
          >
            <Copy className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <span className="animate-in text-sm font-medium text-gray-500">
            {formatTime(recordingTime)}
          </span>

          {isTranscribing && (
            <RotateCw className="size-3.5 animate-spin cursor-pointer rounded-sm text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
}
