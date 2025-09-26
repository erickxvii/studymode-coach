import TypewriterHero from '../components/TypewriterHero';

export default function HomePage() {
  return (
    <main className="px-4 py-16 flex flex-col items-center justify-center text-center">
      {/* Typing effect */}
      <TypewriterHero />

      {/* Subtext */}
      <p className="mt-6 text-slate-600 max-w-2xl">
        Find your best study technique and stay focused with personalized sessions.
      </p>

      {/* Fixed button */}
      <a
        href="/assess"
        className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-white font-medium shadow hover:bg-indigo-700 transition"
      >
        Start Here 
      </a>
    </main>
  );
}
