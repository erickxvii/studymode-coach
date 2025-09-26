'use client';

import type { Answers, Technique } from '@/types/domain';

export function recommend(answers: Answers): { technique: Technique; why: string } {
  const w: Record<Technique, number> = { pomodoro: 0, flow: 0, spaced: 0, recall: 0 };

  // Simple, readable rules
  if (answers.focus_len >= 4) w.flow += 2; else w.pomodoro += 2;
  if (answers.distraction >= 4) { w.pomodoro += 2; w.recall += 1; }
  switch (answers.task_type) {
    case 'Memorization': w.spaced += 2; break;
    case 'Problem solving': w.recall += 2; break;
    case 'Reading': w.flow += 1; break;
    case 'Writing/coding': w.flow += 1; break;
  }
  if (answers.deadline) w.pomodoro += 1;

  const sorted = Object.entries(w).sort((a,b)=>b[1]-a[1]) as [Technique, number][];
  const technique = sorted[0][0];

  const whyBits: string[] = [];
  if (answers.focus_len >= 4) whyBits.push('you can maintain longer focus blocks');
  else whyBits.push('shorter sprints fit your current focus span');

  if (answers.distraction >= 4) whyBits.push('you report high distractibility');
  if (answers.task_type === 'Memorization') whyBits.push('today is heavy on memorization');
  if (answers.task_type === 'Problem solving') whyBits.push('you’re doing problem solving');
  if (answers.deadline) whyBits.push('a deadline is coming up');

  const why = `We picked ${titleOf(technique)} because ${listify(whyBits)}.`;
  return { technique, why };
}

function titleOf(t: Technique) {
  return ({ pomodoro:'Pomodoro', flow:'Flow Blocks', spaced:'Spaced Repetition', recall:'Active Recall Sprints' } as const)[t];
}

function listify(parts: string[]) {
  if (parts.length === 0) return 'it suits your preferences';
  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(', ') + ' and ' + parts.slice(-1);
}
