'use client';

import { Typewriter } from 'react-simple-typewriter';

export default function TypewriterHero() {
  return (
    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-center mt-16">
      <span className="text-indigo-400">Study smarter</span> with{' '}
      <span className="text-slate-900">
        <Typewriter
          words={['Pomodoro', 'Deep Work', 'Flow State', 'Break Balance']}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </span>
    </h1>
  );
}
