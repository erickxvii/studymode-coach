export type Technique = 'pomodoro' | 'flow' | 'spaced' | 'recall';

export type Answers = {
  focus_len: number;        // 1..5
  distraction: number;      // 1..5
  task_type: 'Problem solving' | 'Memorization' | 'Reading' | 'Writing/coding';
  deadline: boolean;
};
