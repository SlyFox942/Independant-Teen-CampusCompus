/**
 * Custom hook for recording audio using the MediaRecorder API.
 * Provides start, stop, pause, resume controls and the resulting blob.
 */

import { useState, useRef, useCallback } from "react";

export type RecordingState = "idle" | "recording" | "paused" | "stopped";
export type AudioFormat = "audio/webm" | "audio/webm;codecs=opus" | "audio/ogg;codecs=opus" | "audio/mp4";

interface UseMediaRecorderOptions {
  /** Preferred MIME type for recording */
  mimeType?: AudioFormat;
  /** Called when recording produces an audio blob */
  onComplete?: (blob: Blob, duration: number) => void;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
}

interface UseMediaRecorderReturn {
  /** Current state of the recorder */
  state: RecordingState;
  /** The recorded audio blob (available after stop) */
  blob: Blob | null;
  /** Duration of recording in seconds */
  duration: number;
  /** Error message if something went wrong */
  error: string | null;
  /** Start recording */
  start: () => Promise<void>;
  /** Stop recording and produce the blob */
  stop: () => void;
  /** Pause recording */
  pause: () => void;
  /** Resume recording */
  resume: () => void;
  /** Reset recording state */
  reset: () => void;
  /** Whether the browser supports MediaRecorder */
  isSupported: boolean;
}

export function useMediaRecorder(options: UseMediaRecorderOptions = {}): UseMediaRecorderReturn {
  const [state, setState] = useState<RecordingState>("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported = typeof MediaRecorder !== "undefined";

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    clearTimer();
    timerRef.current = setInterval(() => {
      setDuration((Date.now() - startTimeRef.current) / 1000);
    }, 100);
  }, [clearTimer]);

  const start = useCallback(async () => {
    if (!isSupported) {
      setError("MediaRecorder is not supported in this browser");
      return;
    }

    try {
      setError(null);
      setBlob(null);
      setDuration(0);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = options.mimeType || "audio/webm;codecs=opus";
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : "audio/webm",
      });

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearTimer();
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const finalDuration = (Date.now() - startTimeRef.current) / 1000;
        setBlob(audioBlob);
        setDuration(finalDuration);
        setState("stopped");

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());

        options.onComplete?.(audioBlob, finalDuration);
      };

      recorder.onerror = () => {
        clearTimer();
        setError("An error occurred during recording");
        setState("idle");
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(1000); // Collect data every second
      startTimer();
      setState("recording");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start recording";
      setError(message);
      options.onError?.(err instanceof Error ? err : new Error(message));
    }
  }, [isSupported, options, clearTimer, startTimer]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const pause = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      clearTimer();
      setState("paused");
    }
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      startTimer();
      setState("recording");
    }
  }, [startTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setBlob(null);
    setDuration(0);
    setError(null);
    setState("idle");
    chunksRef.current = [];
  }, [clearTimer]);

  return {
    state,
    blob,
    duration,
    error,
    start,
    stop,
    pause,
    resume,
    reset,
    isSupported,
  };
}