'use client';

import { useEffect, useState } from 'react';

export default function HideOnScrollHeader({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const goingDown = y > lastY;
      // hide when scrolling down past a bit; show when scrolling up
      setHidden(goingDown && y > 24);
      setLastY(y);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  return (
    <header
  className={`fixed inset-x-0 top-0 z-30 transition-transform duration-200
    ${hidden ? '-translate-y-full' : 'translate-y-0'}
    border-b border-white/60 bg-white/60 shadow-sm backdrop-blur-md rounded-b-2xl
  `}
>
  <div className="mx-auto max-w-5xl px-4">
    <nav className="flex h-14 items-center justify-between">
      {children}
    </nav>
  </div>
</header>

  );
}
