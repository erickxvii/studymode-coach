export type Technique = 'pomodoro' | 'flow' | 'spaced' | 'recall';

export type Schedule =
  | { kind: 'fixed'; work: number; break: number; longEvery?: number; longBreak?: number }
  | { kind: 'sequence'; cycles: Array<{ w: number; b: number }> };

export function scheduleFor(t: Technique): Schedule {
  switch (t) {
    case 'pomodoro':
      return { kind: 'fixed', work: 25 * 60, break: 5 * 60, longEvery: 4, longBreak: 15 * 60 };
    case 'flow':
      return { kind: 'fixed', work: 60 * 60, break: 15 * 60 };
    case 'spaced':
      return { kind: 'sequence', cycles: [{ w: 10 * 60, b: 2 * 60 }, { w: 10 * 60, b: 5 * 60 }, { w: 10 * 60, b: 8 * 60 }] };
    case 'recall':
      return { kind: 'fixed', work: 15 * 60, break: 3 * 60 };
    default:
      return { kind: 'fixed', work: 25 * 60, break: 5 * 60 };
  }
}
