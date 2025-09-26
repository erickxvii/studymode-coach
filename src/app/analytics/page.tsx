'use client';

import { useEffect, useMemo, useState } from 'react';
import StatCard from '@/components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

type SessionLog = {
  at: number;               // timestamp (ms)
  cycle: number;            // cycle index (1-based during session)
  duration: number;         // seconds for completed work block
  technique?: string | null;
  focus?: number;           // optional self rating 1-5 (if you added it)
  result?: string;          // 'done' etc
};

const TECH_COLORS = ['#6366f1', '#60a5fa', '#a78bfa', '#f472b6', '#22d3ee', '#f97316'];

function dayKey(ts: number) {
  const d = new Date(ts);
  // yyyy-mm-dd in local time
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatMin(totalSeconds: number) {
  const m = Math.round(totalSeconds / 60);
  return `${m} min`;
}

function downloadCSV(rows: Array<Record<string, any>>, filename = 'sessions.csv') {
  const headers = Object.keys(rows[0] || { at: '', technique: '', duration: '', focus: '', cycle: '', result: '' });
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsPage() {
  const [rows, setRows] = useState<SessionLog[]>([]);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('smc_sessions') || '[]';
      const parsed: SessionLog[] = JSON.parse(raw);
      // sort newest first
      parsed.sort((a, b) => b.at - a.at);
      setRows(parsed);
    } catch {
      setRows([]);
    }
  }, []);

  // derived
  const totals = useMemo(() => {
    const totalSeconds = rows.reduce((s, r) => s + (r.duration || 0), 0);
    const blocks = rows.length;
    const avgBlock = blocks ? Math.round((totalSeconds / blocks) / 60) : 0;

    // per-day totals (last 14 days)
    const byDayMap = new Map<string, number>();
    rows.forEach(r => {
      const k = dayKey(r.at);
      byDayMap.set(k, (byDayMap.get(k) || 0) + (r.duration || 0));
    });
    const today = new Date();
    const dayData: { day: string; minutes: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = dayKey(d.getTime());
      dayData.push({
        day: `${d.getMonth()+1}/${d.getDate()}`,
        minutes: Math.round((byDayMap.get(k) || 0) / 60),
      });
    }

    // technique distribution
    const byTech = new Map<string, number>();
    rows.forEach(r => {
      const t = (r.technique || 'unknown').toLowerCase();
      byTech.set(t, (byTech.get(t) || 0) + (r.duration || 0));
    });
    const techData = Array.from(byTech.entries()).map(([name, seconds], i) => ({
      name,
      value: Math.round(seconds / 60),
      color: TECH_COLORS[i % TECH_COLORS.length],
    }));

    // streak (consecutive days with > 0 minutes ending today)
    let streak = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const total = byDayMap.get(dayKey(d.getTime())) || 0;
      if (total > 0) streak++;
      else break;
    }

    // avg focus (if exists)
    const focusValues = rows.map(r => r.focus).filter((n): n is number => typeof n === 'number');
    const avgFocus = focusValues.length ? (focusValues.reduce((s, n) => s + n, 0) / focusValues.length).toFixed(1) : '—';

    return { totalSeconds, blocks, avgBlock, dayData, techData, streak, avgFocus };
  }, [rows]);

  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex gap-2">
            <button
              onClick={() => rows.length && downloadCSV(rows)}
              className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm hover:bg-white"
              disabled={!rows.length}
            >
              Export CSV
            </button>
            <button
              onClick={() => { localStorage.removeItem('smc_sessions'); setRows([]); }}
              className="rounded-xl border border-rose-200 bg-white/70 px-3 py-2 text-sm text-rose-600 hover:bg-white"
              disabled={!rows.length}
            >
              Clear Data
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Focused" value={formatMin(totals.totalSeconds)} />
          <StatCard label="Blocks Logged" value={totals.blocks} />
          <StatCard label="Avg Block" value={`${totals.avgBlock} min`} />
          <StatCard label="Streak" value={`${totals.streak} day${totals.streak === 1 ? '' : 's'}`} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-md">
            <div className="mb-3 text-sm font-medium text-slate-700">Minutes per day (last 14 days)</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={totals.dayData}>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-md">
            <div className="mb-3 text-sm font-medium text-slate-700">Technique distribution</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totals.techData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {totals.techData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {totals.techData.map((d, i) => (
                <span key={i} className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-2 py-1">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} /> {d.name} ({d.value}m)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Avg focus if available */}
        <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-md">
          <div className="text-sm text-slate-700">
            Avg self-rated focus: <span className="font-semibold">{totals.avgFocus}</span>
          </div>
        </div>

        {/* Recent sessions table */}
        <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-md">
          <div className="mb-3 text-sm font-medium text-slate-700">Recent sessions</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">When</th>
                  <th className="py-2">Technique</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Focus</th>
                  <th className="py-2">Cycle</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((r, i) => (
                  <tr key={i} className="border-t border-white/60">
                    <td className="py-2">{new Date(r.at).toLocaleString()}</td>
                    <td className="py-2 capitalize">{(r.technique || 'unknown').replace('-', ' ')}</td>
                    <td className="py-2">{formatMin(r.duration || 0)}</td>
                    <td className="py-2">{typeof r.focus === 'number' ? r.focus : '—'}</td>
                    <td className="py-2">{r.cycle ?? '—'}</td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No data yet. Run a session to see analytics.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
