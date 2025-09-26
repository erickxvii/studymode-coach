// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import HideOnScrollHeader from '@/components/HideOnScrollHeader';
import AppShell from '@/components/AppShell';
import BackgroundAccents from '@/components/BackgroundAccents';
import Footer from '@/components/Footer';
// ...


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StudyMode Coach',
  description: 'Find your best study technique and stay on track.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-transparent">
      <body className={`${inter.className} text-slate-900 antialiased flex flex-col  min-h bg-transparent`}>
  {/* Pastel background accents */}
   <BackgroundAccents/> 
  {/* App chrome ... */}
        {/* <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* top-right soft blob */}
          {/* <div className="absolute right-[-120px] top-[-120px] h-[500px] w-[300px] rounded-full bg-sky-600 opacity-40 blur-3xl" />
          {/* top-left soft blob */}
          {/* <div className="absolute left-[-140px] top-[-120px] h-[500px] w-[320px] rounded-full bg-sky-600 opacity-40 blur-3xl" />
          {/* bottom-left soft pink blob */}
          {/* <div className="absolute bottom-[-140px] left-[-120px] h-[320px] w-[320px] rounded-full bg-pink-400 opacity-30 blur-3xl" />
          {/* bottom-right soft pink blob */}
          {/* <div className="absolute bottom-[-140px] right-[-120px] h-[320px] w-[320px] rounded-full bg-pink-400 opacity-30 blur-3xl" />
        </div> */} 
        
 
        {/* App chrome */}
        <div className="mx-auto max-w-5xl px-4">
          {/* Auto-hiding, glassy header */}
          <HideOnScrollHeader>
            <a href="/" className="text-base font-semibold tracking-tight">📚 StudyMode Coach</a>
            <div className="flex items-center gap-4 text-sm">
              
              <a className="hover:text-indigo-700 transition-colors" href="/session">Session</a>
              <a className="hover:text-indigo-700 transition-colors" href="/analytics">Analytics</a>
            </div>
          </HideOnScrollHeader>

          {/* spacer so content isn't under fixed header */}
          <div className="h-14" />

          {/* Main content card-ish container */}
          {/*<main className="mb-10">
            <div className="app-shell rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-md">
              {children}
            </div>
          </main> */}

<main className="mb-10">
  <AppShell>{children}</AppShell>
</main>

          


          {/* Subtle footer */}
          <Footer />

        </div>
      </body>
    </html>
  );
}










