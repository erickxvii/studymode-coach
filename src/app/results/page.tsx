import Link from "next/link";

type Search = { technique?: string; why?: string };

const TECH_META: Record<
  string,
  { title: string; emoji: string; blurb: string }
> = {
  pomodoro: {
    title: "Pomodoro",
    emoji: "🍅",
    blurb: "Short, focused sprints with quick breaks to reset attention.",
  },
  flow: {
    title: "Flow Blocks",
    emoji: "⏱️",
    blurb: "Long deep-work blocks with fewer interruptions.",
  },
  spaced: {
    title: "Spaced Repetition",
    emoji: "🔁",
    blurb: "Short recall bursts with gradually longer gaps.",
  },
  recall: {
    title: "Active Recall Sprints",
    emoji: "🧠",
    blurb: "Test yourself first, then review — maximize retention.",
  },
};

export default function ResultsPage({ searchParams }: { searchParams: Search }) {
  const technique = (searchParams.technique || "pomodoro").toLowerCase();
  const meta = TECH_META[technique] ?? TECH_META["pomodoro"];
  const why =
    searchParams.why ??
    "it matches your preferences and current study context.";

  // If someone hits /results directly with no params, nudge them to assessment.
  const cameEmpty =
    !searchParams.technique && !searchParams.why;

  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Your Study Mode</h1>

        <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur-md">
          {cameEmpty ? (
            <div className="space-y-4">
              <p className="text-slate-700">
                Take the quick assessment to get a personalized recommendation.
              </p>
              <div>
                <Link
                  href="/assess"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
                >
                  Start Assessment
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="text-3xl leading-none">{meta.emoji}</div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {meta.title}
                  </h2>
                  <p className="text-slate-600">{meta.blurb}</p>
                </div>
              </div>

              <hr className="my-5 border-white/70" />

              <p className="text-slate-700">
                <span className="font-medium">Why we chose this:</span>{" "}
                {why}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/session?technique=${encodeURIComponent(technique)}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
                >
                  Start Session
                </Link>
                <Link
                  href="/assess"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-slate-800 transition hover:bg-white"
                >
                  Retake Assessment
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
