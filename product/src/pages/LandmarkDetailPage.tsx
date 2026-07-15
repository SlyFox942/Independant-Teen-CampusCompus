import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getLandmark, getRecording, getRecordingUrl, revokeRecordingUrl, getZone, type Landmark, type Zone, type Recording } from "~/db";

export default function LandmarkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [landmark, setLandmark] = useState<Landmark | null>(null);
  const [zone, setZone] = useState<Zone | null>(null);
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) return;
    loadLandmark(id);
  }, [id]);

  const loadLandmark = async (landmarkId: string) => {
    setLoading(true);
    try {
      const l = await getLandmark(landmarkId);
      if (!l) return;

      setLandmark(l);

      if (l.zoneId && l.zoneId !== "uncategorized") {
        const z = await getZone(l.zoneId);
        setZone(z || null);
      }

      const r = await getRecording(l.audioBlobId);
      setRecording(r || null);
    } catch (err) {
      console.error("Failed to load landmark:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!recording) return;

    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      const url = getRecordingUrl(recording);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        revokeRecordingUrl(url);
        setPlaying(false);
      };
      audio.play();
      setPlaying(true);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-80" />
          </svg>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!landmark) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
          <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">Landmark not found</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Back link */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-brand-600"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        Back to Browse
      </Link>

      {/* Main card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Zone badge */}
        {zone && (
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white" style={{ backgroundColor: zone.color }} />
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              {zone.name}
            </span>
          </div>
        )}

        <h1 className="text-lg font-bold tracking-tight text-gray-900">
          {landmark.title}
        </h1>

        {landmark.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {landmark.description}
          </p>
        )}

        {/* Audio player */}
        {recording && (
          <div className="mt-5 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
            <button
              onClick={handlePlayPause}
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                playing
                  ? "bg-brand-100 text-brand-600 shadow-sm"
                  : "bg-brand-600 text-white shadow-xs hover:bg-brand-700"
              }`}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">
                {playing ? "Playing..." : "Audio Landmark"}
              </div>
              <div className="mt-0.5 text-xs text-gray-400">
                {recording.mimeType} · {Math.round(recording.duration)}s
              </div>
              {playing && (
                <div className="mt-2 flex items-center gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="waveform-bar h-2 w-1 rounded-full bg-brand-400"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-5 flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {landmark.createdBy}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {formatDate(landmark.createdAt)}
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: landmark.title,
              text: `Check out this audio landmark on Campus Compass: ${landmark.title}`,
            });
          } else {
            navigator.clipboard.writeText(
              `${landmark.title} — ${landmark.description}`
            );
          }
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-sm font-semibold text-gray-600 shadow-xs transition-all hover:border-brand-100 hover:text-brand-600 hover:shadow-sm"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        Share Landmark
      </button>
    </div>
  );
}