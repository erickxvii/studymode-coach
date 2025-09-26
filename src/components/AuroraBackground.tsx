'use client';

import { useEffect, useMemo, useRef } from 'react';

export default function AuroraBackground({
  active,
  intensity, // 0..1
}: {
  active: boolean;
  intensity: number;
}) {
  const layer1Ref = useRef<HTMLDivElement | null>(null);
  const layer2Ref = useRef<HTMLDivElement | null>(null);
  const layer3Ref = useRef<HTMLDivElement | null>(null);

  // Ease so early values are subtle and later values ramp nicely
  const eased = useMemo(() => {
    const t = Math.max(0, Math.min(1, intensity));
    return Math.pow(t, 1.25);
  }, [intensity]);

  // 🔧 BUMP: raise base + scale — more visible overall (but still fades to 0 when inactive)
  // was ~0.06 + eased*0.22
  const opacity = active ? 0.25 + eased * 0.45 : 0;

  // 🔧 BUMP: slightly faster motion near finale
  const baseDur = 20000;
  const minDur = 9000;
  const dur = baseDur - (baseDur - minDur) * eased;

  useEffect(() => {
    const els = [layer1Ref.current, layer2Ref.current, layer3Ref.current].filter(Boolean) as HTMLDivElement[];
    els.forEach(el => el.getAnimations().forEach(a => a.cancel()));
    if (!active || !layer1Ref.current || !layer2Ref.current) return;

    // Layer 1 — gentle drift
    layer1Ref.current.animate(
      [
        { transform: 'translate3d(-3%, -2%, 0) scale(1)' },
        { transform: 'translate3d(3%,  2%,  0) scale(1.03)' },
        { transform: 'translate3d(-3%, -2%, 0) scale(1)' },
      ],
      { duration: dur, iterations: Infinity, easing: 'linear' }
    );

    // Layer 2 — counter drift, slightly different easing
    layer2Ref.current.animate(
      [
        { transform: 'translate3d(2%,  1%,  0) scale(1)' },
        { transform: 'translate3d(-2%, -1%, 0) scale(1.04)' },
        { transform: 'translate3d(2%,  1%,  0) scale(1)' },
      ],
      { duration: dur * 1.25, iterations: Infinity, easing: 'ease-in-out' }
    );

    // Layer 3 — very slow parallax (optional, if present)
    if (layer3Ref.current) {
      layer3Ref.current.animate(
        [
          { transform: 'translate3d(-1%, 0%, 0) scale(1.01)' },
          { transform: 'translate3d(1%,  0%, 0) scale(1.02)' },
          { transform: 'translate3d(-1%, 0%, 0) scale(1.01)' },
        ],
        { duration: dur * 1.8, iterations: Infinity, easing: 'ease-in-out' }
      );
    }
  }, [active, dur]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[1]"
      style={{ opacity: 1 }}
    >
      {/* Layer 1 – neon green blob */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 blur-[20px]"
        style={{
          background:
            'radial-gradient(40% 40% at 30% 30%, rgba(0,255,0,0.9) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      {/* Layer 2 – neon blue blob */}
      <div
        ref={layer2Ref}
        className="absolute inset-0 blur-[30px]"
        style={{
          background:
            'radial-gradient(50% 50% at 70% 70%, rgba(0,0,255,0.7) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      {/* Layer 3 – neon red blob */}
      <div
        ref={layer3Ref}
        className="absolute inset-0 blur-[50px]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(255,0,0,0.5) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
    </div>
  );
  
}
