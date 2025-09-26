'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SessionTimer from '@/components/SessionTimer';
import AuroraBackground from '@/components/AuroraBackground';
import { scheduleFor, type Technique } from '@/lib/schedule';

export default function SessionPage() {
  const search = useSearchParams();
  const technique = (search.get('technique') as Technique) || 'pomodoro';
  const schedule = useMemo(() => scheduleFor(technique), [technique]);

  // 🌌 ambient state for full-screen aurora
  const [ambient, setAmbient] = useState<{ active: boolean; intensity: number }>({
    active: false,
    intensity: 0,
  });

  // 🔒 mark this route so we can override the global shell
  useEffect(() => {
    document.documentElement.classList.add('session-page');
    return () => document.documentElement.classList.remove('session-page');
  }, []);

  return (
    <main className="px-4 py-10">
      {/* 🌌 Full-screen background, only on session page */}
      <AuroraBackground active={ambient.active} intensity={ambient.intensity} />

      


      {/* 👇 Only the timer — no cards, no heading */}
      <div className="relative z-10 mx-auto max-w-2xl flex justify-center">
        <SessionTimer
          schedule={schedule}
          onAmbientChange={(active, intensity) => setAmbient({ active, intensity })}
        />
      </div>
    </main>
  );
}
