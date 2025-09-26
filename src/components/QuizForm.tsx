'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import type { Answers } from '@/types/domain';
import { recommend } from '@/lib/recommend';

export default function QuizForm() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Partial<Answers>>({
    focus_len: 3,
    distraction: 3,
  });

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }

  const allAnswered =
    typeof answers.focus_len === 'number' &&
    typeof answers.distraction === 'number' &&
    typeof answers.task_type === 'string' &&
    typeof answers.deadline === 'boolean';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allAnswered) return;

    const { technique, why } = recommend(answers as Answers);

    try {
      const history = JSON.parse(localStorage.getItem('assessments') || '[]');
      history.push({ at: Date.now(), answers, technique, why });
      localStorage.setItem('assessments', JSON.stringify(history));
    } catch {}

    const params = new URLSearchParams({ technique, why });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold"></h1>
      <p className="text-gray-600">
        
      </p>

      {questions.map((q) => (
  <div
    key={q.id}
    className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-md p-4 shadow-sm transition hover:border-white/80"
  >
    <label className="block font-medium text-slate-900">{q.text}</label>

    {/* SCALE */}
    {q.type === 'scale' && (
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{q.min}</span>
          <input
            type="range"
            min={q.min}
            max={q.max}
            value={(answers as any)[q.id] ?? Math.floor((q.min + q.max) / 2)}
            onChange={(e) => update(q.id as any, Number(e.target.value))}
          />
          <span className="text-xs text-slate-500">{q.max}</span>
          
          
        </div>
      </div>
    )}

    {/* SINGLE-SELECT */}
    {q.type === 'single' && (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {q.options.map((opt) => {
          const active = (answers as any)[q.id] === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => update(q.id as any, opt as any)}
              className={`rounded-lg border px-3 py-2 text-left transition
                ${active
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                  : 'bg-white text-slate-800 border-slate-150 hover:bg-white'}
              `}
            >
              {opt}
            </button>
          );
        })}
      </div>
    )}

    {/* YES / NO */}
    {q.type === 'bool' && (
      <div className="mt-3 flex gap-2">
        {([true, false] as const).map((val) => {
          const active = (answers as any)[q.id] === val;
          return (
            <button
              key={String(val)}
              type="button"
              onClick={() => update(q.id as any, val as any)}
              className={`rounded-lg border px-3 py-2 transition
                ${active
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                  : 'bg-white text-slate-800 border-slate-150 hover:bg-slate-50'}
              `}
            >
              {val ? 'Yes' : 'No'}
            </button>
          );
        })}
      </div>
    )}
  </div>
))}

{/* CTA */}
<div className="pt-4">
  <button
    type="submit"
    disabled={!allAnswered}
    className={`w-full px-5 py-3 rounded-xl text-white transition
      ${allAnswered
        ? 'bg-indigo-600 hover:bg-indigo-700 shadow'
        : 'bg-slate-300 cursor-not-allowed'}
    `}
  >
    See my recommendation
  </button>
</div>


    </form>
  );
}
