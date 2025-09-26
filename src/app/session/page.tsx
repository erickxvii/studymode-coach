'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SessionTimer from '@/components/SessionTimer';
import AuroraBackground from '@/components/AuroraBackground';
import { scheduleFor, type Technique } from '@/lib/schedule';

function SessionContent() {
  const search = useSearchParams();
  const technique = (search.get('technique') as Technique) || 'pomodoro';
  const schedule = useMemo(() => scheduleFor(technique), [technique]);

  // ambient state for full-screen aurora
  const [ambient, setAmbient] = useState<{ active: boolean; intensity: number }>({
    active: false,
    intensity: 0,
  });

  return (
    <main className="px-4 py-10">
      {/* background */}
      <AuroraBackground active={ambient.active} intensity={ambient.intensity} />

      {/* timer only */}
      <div className="relative z-10 mx-auto max-w-2xl flex justify-center">
        <SessionTimer
          schedule={schedule}
          onAmbientChange={(active, intensity) => setAmbient({ active, intensity })}
        />
      </div>
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading session…</div>}>
      <SessionContent />
    </Suspense>
  );
}
