export type Question =
  | { id: 'focus_len'; text: string; type: 'scale'; min: number; max: number }
  | { id: 'distraction'; text: string; type: 'scale'; min: number; max: number }
  | { id: 'task_type'; text: string; type: 'single'; options: string[] }
  | { id: 'deadline'; text: string; type: 'bool' };

export const questions: Question[] = [
  { id: 'focus_len', text: 'How long can you stay focused in one sitting?', type: 'scale', min: 1, max: 5 },
  { id: 'distraction', text: 'How easily do you get distracted?', type: 'scale', min: 1, max: 5 },
  { id: 'task_type', text: 'What are you studying today?', type: 'single', options: ['Problem solving', 'Memorization', 'Reading', 'Writing/coding'] },
  { id: 'deadline', text: 'Do you have a deadline within 48 hours?', type: 'bool' },
];
