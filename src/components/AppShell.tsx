'use client';

import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSession = pathname.startsWith('/session');
  const isHome = pathname === '/'; // 👈 add this

  // No glass shell on Home or Session
  if (isHome || isSession) {
    return <>{children}</>;
  }

  // Glass shell everywhere else
  return (
    <div className="app-shell rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      {children}
    </div>
  );
}
