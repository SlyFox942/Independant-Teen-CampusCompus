import { useState, useEffect, useRef } from "react";
import { getAllLandmarks, getAllRoutes, getRecording, getRecordingUrl, revokeRecordingUrl, type Landmark, type Route } from "~/db";

export default function NavigatePage() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [destinationId, setDestinationId] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allLandmarks, allRoutes] = await Promise.all([
        getAllLandmarks(),
        getAllRoutes(),
      ]);
      setLandmarks(allLandmarks);
      setRoutes(allRoutes);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleSelectDestination = (landmarkId: string) => {
    setDestinationId(landmarkId);
    setIsNavigating(true);
    setCurrentStep(0);
    setCompleted(false);
  };

  const startNavigation = async () => {
    if (!destinationId) return;
    setIsNavigating(true);
    setCurrentStep(0);
    setCompleted(false);
    await playStep(0);
  };

  const playStep = async (stepIndex: number) => {
    const landmark = landmarks.find((l) => l.id === destinationId);
    if (!landmark) return;

    const recording = await getRecording(landmark.audioBlobId);
    if (!recording) return;

    const url = getRecordingUrl(recording);
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onended = () => {
      revokeRecordingUrl(url);
      setCurrentStep(stepIndex + 1);
      if (stepIndex + 1 >= 1) {
        setCompleted(true);
      }
    };

    audio.play();
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setCompleted(false);
    playStep(0);
  };

  const handleStop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsNavigating(false);
    setCompleted(false);
    setCurrentStep(0);
  };

  const selectedLandmark = landmarks.find((l) => l.id === destinationId);

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Navigate Campus
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a destination and follow audio cues to get there
        </p>
      </div>

      {!isNavigating && !completed && (
        <>
          {/* Destination picker */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Where do you want to go?
            </label>

            {landmarks.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                    <svg className="h-7 w-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 2 15 9 22 9" />
                      <polyline points="12 22 9 15 2 15" />
                      <polyline points="2 9 9 9 12 2" />
                      <polyline points="22 15 15 15 12 22" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  No landmarks yet. Record some landmarks first to navigate with them.
                </p>
              </div>
            ) : (
              <div className="landmark-list space-y-1.5 overflow-y-auto" style={{ maxHeight: "320px" }}>
                {landmarks
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((landmark) => (
                    <button
                      key={landmark.id}
                      onClick={() => handleSelectDestination(landmark.id)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all ${
                        destinationId === landmark.id
                          ? "border border-brand-200 bg-brand-50 shadow-xs"
                          : "border border-transparent bg-gray-50 hover:border-gray-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                          destinationId === landmark.id
                            ? "bg-brand-200 text-brand-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900">
                            {landmark.title}
                          </div>
                          {landmark.description && (
                            <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                              {landmark.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {destinationId && (
            <button
              onClick={startNavigation}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 2 15 9 22 9" />
                <polyline points="12 22 9 15 2 15" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              Start Navigation
            </button>
          )}
        </>
      )}

      {/* Navigation in progress */}
      {isNavigating && !completed && (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="pulse-recording flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 shadow-inner">
            <svg className="h-12 w-12 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 2 15 9 22 9" />
              <polyline points="12 22 9 15 2 15" />
              <polyline points="2 9 9 9 12 2" />
              <polyline points="22 15 15 15 12 22" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Follow the Audio Cue
            </h2>
            {selectedLandmark && (
              <p className="mt-1 text-sm text-gray-500">
                Heading to: <span className="font-semibold text-gray-700">{selectedLandmark.title}</span>
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReplay}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Replay
            </button>
            <button
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Navigation completed */}
      {completed && (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-green-100 bg-green-50/50 p-8 text-center shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <svg className="h-12 w-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">You've Arrived!</h2>
            {selectedLandmark && (
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{selectedLandmark.title}</span>
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReplay}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Listen Again
            </button>
            <button
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-xs ring-1 ring-gray-200 transition-all hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}