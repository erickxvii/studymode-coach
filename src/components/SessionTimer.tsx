'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Schedule } from '@/lib/schedule';



type Phase = 'work' | 'break';

const R = 84; // circle radius (px)
const CIRC = 2 * Math.PI * R;

export default function SessionTimer({
  schedule,
  onAmbientChange, 
 }: {
  schedule: Schedule;
 onAmbientChange?: (active: boolean, intensity: number) => void; }) {
  const [phase, setPhase] = useState<Phase>('work');
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1); // number of work blocks completed (1-based)
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds(schedule, 'work'));
  const [totalThisBlock, setTotalThisBlock] = useState<number>(initialSeconds(schedule, 'work'));

  const intervalRef = useRef<number | null>(null);

  // progress (0..1)
  const progress = useMemo(() => {
    const used = totalThisBlock - secondsLeft;
    const p = Math.min(Math.max(used / totalThisBlock, 0), 1);
    return Number.isFinite(p) ? p : 0;
  }, [secondsLeft, totalThisBlock]);

  // pause on tab switch
  useEffect(() => {
    function vis() { if (document.hidden) setRunning(false); }
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);

  // keyboard: space = start/pause, arrow-right = skip, r = reset
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ') { e.preventDefault(); setRunning(r => !r); }
      if (e.key === 'ArrowRight') { e.preventDefault(); skip(); }
      if (e.key.toLowerCase() === 'r') { e.preventDefault(); reset(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ticking
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = window.setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  // phase transition + CHIME + SAVE SESSION (when work finishes)
  useEffect(() => {
    if (secondsLeft > 0) return;

    // chime (optional)
    try {
      const audioEl = document.getElementById('smc-chime') as HTMLAudioElement | null;
      audioEl?.play().catch(() => {});
    } catch {}

    if (phase === 'work') { 
    let userFocus: number | null = null;
    try {
      const ans = window.prompt('How focused were you this block? (1–5)', '4');
      const n = Number(ans);
      userFocus = Number.isFinite(n)
        ? Math.min(5, Math.max(1, Math.round(n)))
        : null;
  } catch {}
      // ✅ LOG FINISHED WORK BLOCK
      logBlock({
        cycle,
        duration: totalThisBlock,            // seconds
        technique: getTechniqueFromURL(),    // e.g., "pomodoro"
        focus: userFocus ?? undefined,
        result: 'done',
      });

      // finished a work block → go to break
      const next = nextBreakSeconds(schedule, cycle);
      setPhase('break');
      setTotalThisBlock(next);
      setSecondsLeft(next);
    } else {
      // finished a break → go to next work
      const next = nextWorkSeconds(schedule, cycle + 1);
      setPhase('work');
      setCycle(c => c + 1);
      setTotalThisBlock(next);
      setSecondsLeft(next);
    }
  }, [secondsLeft, phase, schedule, cycle, totalThisBlock]);

  function startPause() {
    setRunning(r => !r);
  }

  function reset() {
    setRunning(false);
    setPhase('work');
    setCycle(1);
    const init = initialSeconds(schedule, 'work');
    setTotalThisBlock(init);
    setSecondsLeft(init);
  }

  function skip() {
    setRunning(false);
    if (phase === 'work') {
      const next = nextBreakSeconds(schedule, cycle);
      setPhase('break');
      setTotalThisBlock(next);
      setSecondsLeft(next);
    } else {
      const next = nextWorkSeconds(schedule, cycle + 1);
      setPhase('work');
      setCycle(c => c + 1);
      setTotalThisBlock(next);
      setSecondsLeft(next);
    }
  }

  // --- helpers (inside component, above return) ---

  function logBlock(data: any) {
    try {
      const key = 'smc_sessions';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ ...data, at: Date.now() });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch {}
  }

  function getTechniqueFromURL(): string | null {
    if (typeof window === 'undefined') return null;
    const sp = new URLSearchParams(window.location.search);
    return sp.get('technique');
  }

  const color = phase === 'work' ? 'stroke-indigo-500' : 'stroke-violet-500';
  const textColor = phase === 'work' ? 'text-indigo-700' : 'text-violet-700';
  const dash = CIRC - CIRC * progress;

  const showAurora = running && phase === 'work';
  const secondsFinale = Math.max(0, Math.min(10, secondsLeft));
  const finaleBoost = secondsLeft <= 10 ? (1 - secondsFinale / 10) * 0.25 : 0;
  const auroraIntensity = Math.max(0, Math.min(1, progress + finaleBoost));


  return(
  <div className="relative">
 
  <div className="relative z-10">
    <div className="flex items-center justify-betwee gap-12">
      <span
        className={`inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs ${textColor} border border-white/60`}
      >
        {phase === 'work' ? 'Focus' : 'Break'} • Cycle {cycle}
      </span>
      <span className="text-xs text-slate-500">
        Space = start/pause | R = reset
      </span>
    </div>

    {/* ...the rest of your timer content unchanged... */}
  </div>
<div>
  
        <div className="mt-6 flex flex-col items-center">
          <div className="relative h-56 w-56">
            {/* background ring */}
            <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r={R}
                className="stroke-slate-200/60"
                strokeWidth="14"
                fill="none"
              />
              {/* progress ring */}
              <circle
                cx="100"
                cy="100"
                r={R}
                className={`${color} transition-[stroke-dashoffset] duration-300 ease-linear`}
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dash}
              />
            </svg>
            {/* time text */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-5xl font-bold tabular-nums">
                  {format(secondsLeft)}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {phase === 'work' ? 'Time to focus' : 'Take a breather'}
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={startPause}
              className={`px-5 py-2 rounded-xl text-white transition ${
                running
                  ? 'bg-slate-600 hover:bg-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={skip}
              className="px-5 py-2 rounded-xl border border-slate-200 bg-white/70 hover:bg-white"
            >
              Skip
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 rounded-xl border border-slate-200 bg-white/70 hover:bg-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function format(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

function initialSeconds(schedule: Schedule, phase: Phase) {
  if (schedule.kind === 'fixed') return phase === 'work' ? schedule.work : schedule.break;
  const first = schedule.cycles[0];
  return phase === 'work' ? first.w : first.b;
}

function nextWorkSeconds(schedule: Schedule, cycle: number) {
  if (schedule.kind === 'fixed') return schedule.work;
  const idx = Math.min(cycle - 1, schedule.cycles.length - 1);
  return schedule.cycles[idx].w;
}

function nextBreakSeconds(schedule: Schedule, cycle: number) {
  if (schedule.kind === 'fixed') {
    if (schedule.longEvery && schedule.longBreak && cycle % schedule.longEvery === 0) {
      return schedule.longBreak;
    }
    return schedule.break;
  }
  const idx = Math.min(cycle - 1, schedule.cycles.length - 1);
  return schedule.cycles[idx].b;
}
