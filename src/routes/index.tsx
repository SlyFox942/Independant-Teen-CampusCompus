import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { submitToWaitlist } from "~/lib/waitlist";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    role: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitToWaitlist({ data: formData });
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", school: "", role: "", message: "" });
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-linear-to-br from-brand-50 via-white to-accent-50">
        {/* Background grid decoration */}
        <div className="bg-grid pointer-events-none absolute inset-0" />

        {/* Floating gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-36 lg:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Text */}
            <div className="animate-fade-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                <span className="flex h-2 w-2 rounded-full bg-brand-500" />
                No beacons. No dead zones. No expensive hardware.
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Turn any school into an{" "}
                <span className="text-gradient">audio-guided map</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600 sm:text-xl">
                Students record short audio landmarks — a water fountain hum, a
                squeaky door — that others follow to reach classrooms, the office,
                or the cafeteria. It gives teens independence and confidence
                navigating large campuses.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/#waitlist"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-200 active:scale-[0.98]"
                >
                  Get Early Access
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <a
                  href="/#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-xs transition-all hover:border-gray-300 hover:shadow-sm active:scale-[0.98]"
                >
                  See How It Works
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand-200 to-accent-200 text-xs font-bold text-brand-800"
                    >
                      {["AJ", "MK", "TR", "SP"][i - 1]}
                    </div>
                  ))}
                </div>
                <span>
                  Trusted by <strong className="text-gray-900">50+</strong>{" "}
                  schools in pilot program
                </span>
              </div>
            </div>

            {/* Right: Hero image */}
            <div className="animate-fade-in animation-delay-200 relative flex items-center justify-center">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-8 rounded-full bg-linear-to-r from-brand-200/30 via-accent-200/30 to-brand-200/30 blur-2xl" />

                {/* Main image */}
                <img
                  src="/images/hero-illustration.png"
                  alt="Campus Compass navigation illustration"
                  className="relative rounded-2xl shadow-2xl shadow-brand-200/40 ring-1 ring-brand-100/20"
                  width={600}
                  height={400}
                />

                {/* Floating badge */}
                <div className="animate-float absolute -bottom-4 -left-4 rounded-xl bg-white px-4 py-3 shadow-xl ring-1 ring-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100">
                      <svg
                        className="h-4 w-4 text-accent-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Audio Landmarks
                      </p>
                      <p className="text-xs text-gray-500">
                        Recorded by students
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="scroll-mt-20 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Three simple steps to{" "}
              <span className="text-gradient">audio wayfinding</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No hardware, no IT setup. Just students and their phones.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Record a Landmark
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Students record a short audio clip — 15 seconds of a water
                fountain, a squeaky door, or the cafeteria hum. Each clip becomes
                a landmark.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
                ~15 seconds per clip
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Build Your Route
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Follow landmarks step by step. Each audio clue guides you closer
                — from the front gate to the gym, or the office to the
                cafeteria.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
                Landmark-to-landmark navigation
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Navigate with Confidence
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                No Wi-Fi? No problem. Everything works offline. New students and
                visitors find their way on day one — no confusion, no getting
                lost.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
                Works offline, no data needed
              </div>
            </div>
          </div>

          {/* Image showcase */}
          <div className="mt-16 flex justify-center">
            <img
              src="/images/audio-landmark.png"
              alt="Audio landmark concept showing a smartphone connecting to school locations"
              className="max-h-64 rounded-xl shadow-md ring-1 ring-gray-100"
            />
          </div>
        </div>
      </section>

      {/* ─── FOR SCHOOLS SECTION ─── */}
      <section
        id="for-schools"
        className="scroll-mt-20 bg-gradient-to-br from-brand-50 via-white to-accent-50 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-700">
              For Schools
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for <span className="text-gradient">schools</span>, by people
              who understand education
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to help students navigate with independence.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-brand-100/50 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <svg
                  className="h-5 w-5 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">No Hardware Needed</h3>
              <p className="mt-2 text-sm text-gray-600">
                Zero installation. No beacons, no Wi-Fi setup, no IT tickets.
                Students just use their phones — existing devices, no extra cost.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-brand-100/50 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <svg
                  className="h-5 w-5 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">
                Empowers All Students
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Especially powerful for new students and those with visual
                impairments. Audio cues make navigation intuitive and accessible
                for everyone.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-brand-100/50 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <svg
                  className="h-5 w-5 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">
                Community-Powered
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Students create the landmarks. Upperclassmen record routes for
                new students. The campus map grows organically as more people
                contribute.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-brand-100/50 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <svg
                  className="h-5 w-5 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">
                Works Offline
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                No Wi-Fi dead zones — everything is stored on the device. Works
                in basements, gyms, outdoor fields, and anywhere with no cell
                service.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-2xl border border-brand-100/50 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <svg
                  className="h-5 w-5 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">
                Easy Admin Dashboard
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Monitor navigation patterns, see which landmarks are most used,
                and get alerts if a student hasn't reached their destination.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-2xl border border-brand-100/50 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <svg
                  className="h-5 w-5 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">
                Affordable Pricing
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Annual school subscription based on enrollment. No per-student
                fees, no hidden costs. Premium tier includes analytics and bell
                schedule integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING SECTION ─── */}
      <section
        id="pricing"
        className="scroll-mt-20 bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              Pricing
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent{" "}
              <span className="text-gradient">pricing</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              One annual subscription. No per-student fees, no hidden costs.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Free tier */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <p className="mt-1 text-sm text-gray-500">
                For small schools exploring audio wayfinding
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">Free</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Up to 50 landmarks",
                  "Basic audio recording",
                  "Community landmarks only",
                  "Email support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/#waitlist"
                className="mt-8 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                Get Started
              </a>
            </div>

            {/* Pro tier */}
            <div className="relative rounded-2xl border-2 border-brand-500 bg-white p-8 shadow-lg shadow-brand-100/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-block rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="mt-1 text-sm text-gray-500">
                For most middle and high schools
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$TBD</span>
                <span className="text-sm text-gray-500">/year</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Based on school enrollment tier
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited landmarks",
                  "Offline navigation",
                  "Admin dashboard",
                  "Student analytics",
                  "Priority support",
                  "Lost-student alerts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/#waitlist"
                className="mt-8 block w-full rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
              >
                Get Early Access
              </a>
            </div>

            {/* Enterprise tier */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Premium
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                For districts and large campuses
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$TBD</span>
                <span className="text-sm text-gray-500">/year</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Custom pricing for your district
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Everything in Pro",
                  "Bell schedule integration",
                  "Multi-campus management",
                  "Custom branding",
                  "Dedicated account manager",
                  "API access",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/#waitlist"
                className="mt-8 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                Contact Sales
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Prices shown are placeholders. Final pricing will be confirmed before
            launch. Join the waitlist to be first to know.
          </p>
        </div>
      </section>

      {/* ─── STATS / TRUST BAR ─── */}
      <section className="border-y border-brand-100/50 bg-brand-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "50+", label: "Schools Piloting" },
              { value: "10K+", label: "Landmarks Recorded" },
              { value: "98%", label: "Navigation Success" },
              { value: "0", label: "Hardware Required" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gradient sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WAITLIST / CONTACT SECTION ─── */}
      <section
        id="waitlist"
        className="scroll-mt-20 bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get Early Access
            </h2>
            <p className="mt-4 text-lg text-brand-100">
              Be the first school in your district to try Campus Compass. Join
              our pilot program and help shape the future of school navigation.
            </p>
          </div>

          <form
            className="mt-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="mt-1 block w-full rounded-xl border border-brand-400/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-brand-200 backdrop-blur-sm focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@school.edu"
                  className="mt-1 block w-full rounded-xl border border-brand-400/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-brand-200 backdrop-blur-sm focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label
                  htmlFor="school"
                  className="block text-sm font-medium text-white"
                >
                  School Name
                </label>
                <input
                  type="text"
                  id="school"
                  placeholder="Lincoln High School"
                  className="mt-1 block w-full rounded-xl border border-brand-400/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-brand-200 backdrop-blur-sm focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-white"
                >
                  Your Role
                </label>
                <select
                  id="role"
                  className="mt-1 block w-full rounded-xl border border-brand-400/30 bg-white/10 px-4 py-2.5 text-sm text-white backdrop-blur-sm focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 [&>option]:text-gray-900"
                >
                  <option value="" className="text-gray-500">
                    Select your role
                  </option>
                  <option value="admin">Administrator</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-white"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Tell us about your school's needs..."
                className="mt-1 block w-full rounded-xl border border-brand-400/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-brand-200 backdrop-blur-sm focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-lg transition-all hover:bg-brand-50 hover:shadow-xl active:scale-[0.98]"
            >
              Join the Waitlist
            </button>

            <p className="mt-4 text-center text-xs text-brand-200">
              No spam, ever. We'll only email you about Campus Compass updates
              and early access opportunities.
            </p>
          </form>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to transform your school's{" "}
            <span className="text-gradient">navigation</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-gray-600">
            Join 50+ schools already piloting Campus Compass. Give your students
            the independence they deserve.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/#waitlist"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl active:scale-[0.98]"
            >
              Get Early Access
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="/#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-xs transition-all hover:border-gray-300 hover:shadow-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </>
  );
}