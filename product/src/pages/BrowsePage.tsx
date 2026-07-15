import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllLandmarks, getAllZones, getRecording, getRecordingUrl, revokeRecordingUrl, type Landmark, type Zone } from "~/db";

export default function BrowsePage() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allLandmarks, allZones] = await Promise.all([
        getAllLandmarks(),
        getAllZones(),
      ]);
      setLandmarks(allLandmarks);
      setZones(allZones);
    } catch (err) {
      console.error("Failed to load landmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (landmark: Landmark) => {
    if (playingId === landmark.id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(landmark.id);
    const recording = await getRecording(landmark.audioBlobId);
    if (recording) {
      const url = getRecordingUrl(recording);
      const audio = new Audio(url);
      audio.onended = () => {
        revokeRecordingUrl(url);
        setPlayingId(null);
      };
      audio.play().catch(() => {
        revokeRecordingUrl(url);
        setPlayingId(null);
      });
    }
  };

  const filteredLandmarks =
    selectedZone === "all"
      ? landmarks
      : landmarks.filter((l) => l.zoneId === selectedZone);

  const getZoneName = (zoneId: string) => {
    if (zoneId === "uncategorized") return "Uncategorized";
    const zone = zones.find((z) => z.id === zoneId);
    return zone?.name || "Unknown Zone";
  };

  const getZoneColor = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone?.color || "#94a3b8";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-80" />
          </svg>
          <p className="text-sm text-gray-400">Loading landmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Browse Landmarks
          </h1>
          <p className="text-sm text-gray-500">
            {landmarks.length} landmark{landmarks.length !== 1 ? "s" : ""} on campus
          </p>
        </div>
        <Link
          to="/record"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm"
          aria-label="Add new landmark"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>

      {/* Zone filter */}
      <div className="zone-scroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setSelectedZone("all")}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            selectedZone === "all"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedZone === zone.id
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {zone.name}
          </button>
        ))}
      </div>

      {/* Landmark list */}
      {filteredLandmarks.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No landmarks found in this area yet.</p>
          <Link
            to="/record"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Record the first landmark
          </Link>
        </div>
      ) : (
        <div className="landmark-list space-y-2.5 overflow-y-auto">
          {filteredLandmarks.map((landmark, i) => (
            <div
              key={landmark.id}
              className="animate-fade-in-up group rounded-xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-brand-100 hover:shadow-sm"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full ring-1 ring-white"
                      style={{ backgroundColor: getZoneColor(landmark.zoneId) }}
                    />
                    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      {getZoneName(landmark.zoneId)}
                    </span>
                  </div>
                  <Link
                    to={`/browse/${landmark.id}`}
                    className="text-sm font-semibold text-gray-900 transition-colors hover:text-brand-600"
                  >
                    {landmark.title}
                  </Link>
                  {landmark.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                      {landmark.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handlePlay(landmark)}
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                    playingId === landmark.id
                      ? "bg-brand-100 text-brand-600 shadow-sm"
                      : "bg-gray-50 text-gray-400 hover:bg-brand-50 hover:text-brand-500"
                  }`}
                  aria-label={playingId === landmark.id ? "Stop" : "Play"}
                >
                  {playingId === landmark.id ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8,5 19,12 8,19" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}