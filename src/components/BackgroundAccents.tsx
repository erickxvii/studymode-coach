'use client';

import { usePathname } from 'next/navigation';

export default function BackgroundAccents() {
  const pathname = usePathname();
  const isSession = pathname.startsWith('/session');
  if (isSession) return null; // 🔕 hide blobs on the session page

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* top-right soft blob */}
      <div className="absolute right-[-120px] top-[-120px] h-[280px] w-[280px] rounded-full bg-sky-400 opacity-60 blur-3xl" />
      {/* left-center soft blob */}
      <div className="absolute left-[-140px] top-[-120px] h-[320px] w-[320px] rounded-full bg-sky-400 opacity-60 blur-3xl" />
      {/* bottom-left soft pink blob */}
      <div className="absolute bottom-[-140px] left-[-120px] h-[280px] w-[280px] rounded-full bg-pink-400 opacity-60 blur-3xl" />
      {/* bottom-right soft pink blob */}
      <div className="absolute bottom-[-140px] right-[-120px] h-[280px] w-[280px] rounded-full bg-pink-400 opacity-60 blur-3xl" />
    </div>
  );
}
