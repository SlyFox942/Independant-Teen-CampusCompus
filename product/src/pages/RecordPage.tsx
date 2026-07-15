import { useState, useRef, useEffect } from "react";
import { useMediaRecorder } from "~/hooks";
import { addLandmark, addRecording, generateId, getAllZones, type Zone } from "~/db";

export default function RecordPage() {
  const {
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
  } = useMediaRecorder();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [zones, setZones] = useState<Zone[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    getAllZones().then(setZones);
  }, []);

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [blob]);

  const handleSave = async () => {
    if (!blob || !title.trim()) return;

    setSaving(true);
    try {
      const recordingId = await generateId();
      const landmarkId = await generateId();

      await addRecording({
        id: recordingId,
        blob,
        mimeType: blob.type,
        duration,
        createdAt: Date.now(),
      });

      await addLandmark({
        id: landmarkId,
        title: title.trim(),
        description: description.trim(),
        zoneId: zoneId || "uncategorized",
        audioBlobId: recordingId,
        createdBy: "student",
        createdAt: Date.now(),
        tags: [],
      });

      setSaved(true);
      reset();
      setTitle("");
      setDescription("");
      setZoneId("");
    } catch (err) {
      console.error("Failed to save landmark:", err);
    } finally {
      setSaving(false);
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!isSupported) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
          <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Not Supported</h2>
        <p className="max-w-xs text-sm text-gray-500">
          Audio recording is not supported in this browser. Please use a modern browser like Chrome or Firefox.
        </p>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Landmark Saved!</h2>
        <p className="max-w-xs text-sm text-gray-500">
          Your audio landmark has been added to the campus map.
        </p>
        <button
          onClick={() => setSaved(false)}
          className="mt-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm"
        >
          Record Another
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Record a Landmark
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a short audio clip that describes a location on campus
        </p>
      </div>

      {/* Recording controls */}
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Recording indicator */}
        {state === "recording" && (
          <div className="pulse-recording flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-sm font-semibold text-red-500">Recording</span>
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-medium text-red-600">
              {formatDuration(duration)}
            </span>
          </div>
        )}

        {state === "paused" && (
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-amber-600">Paused</span>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-sm font-medium text-amber-600">
              {formatDuration(duration)}
            </span>
          </div>
        )}

        {state === "idle" && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 shadow-inner">
              <svg className="h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Tap to start recording</p>
          </div>
        )}

        {/* Waveform */}
        {state === "recording" && (
          <div className="flex h-8 items-center gap-[3px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="waveform-bar w-1 rounded-full bg-brand-500"
                style={{ height: `${10 + Math.random() * 18}px` }}
              />
            ))}
          </div>
        )}

        {/* Control buttons */}
        <div className="flex items-center gap-4">
          {(state === "idle" || state === "stopped") && (
            <button
              onClick={start}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 hover:shadow-xl active:scale-95"
              aria-label="Start recording"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="6" />
              </svg>
            </button>
          )}

          {state === "recording" && (
            <>
              <button
                onClick={pause}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-200 transition-all hover:bg-amber-600 active:scale-95"
                aria-label="Pause recording"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </button>
              <button
                onClick={stop}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg transition-all hover:bg-gray-700 active:scale-95"
                aria-label="Stop recording"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            </>
          )}

          {state === "paused" && (
            <>
              <button
                onClick={resume}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-200 transition-all hover:bg-green-600 active:scale-95"
                aria-label="Resume recording"
              >
                <svg className="h-6 w-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              </button>
              <button
                onClick={stop}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg transition-all hover:bg-gray-700 active:scale-95"
                aria-label="Stop recording"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Playback preview */}
      {audioUrl && state === "stopped" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553l-10.5 3M18.75 15.75h-16.5M18.75 8.25h-16.5" />
            </svg>
            Preview
          </h3>
          <audio ref={audioRef} src={audioUrl} controls className="w-full rounded-lg [&::-webkit-media-controls-panel]:bg-brand-50" />
          <p className="mt-1.5 text-xs text-gray-400">
            Duration: {formatDuration(duration)}
          </p>
        </div>
      )}

      {/* Details form */}
      {state === "stopped" && blob && (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            Landmark Details
          </h3>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., "Water fountain hum near Room 201"'
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='e.g., "The water fountain in the east hallway outside Room 201 makes a distinct humming sound"'
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Campus Area / Zone
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Select a zone...</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
              <option value="uncategorized">Uncategorized</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Landmark"
            )}
          </button>
        </div>
      )}
    </div>
  );
}