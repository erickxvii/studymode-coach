// 'use client';

// import React, { useEffect, useMemo, useRef } from 'react';

// export default function AuroraFlow({
//   active,
//   intensity, // 0..1
// }: {
//   active: boolean;
//   intensity: number;
// }) {
//   const layer1Ref = useRef<HTMLDivElement | null>(null);
//   const layer2Ref = useRef<HTMLDivElement | null>(null);

//   // clamp + ease
//   const eased = useMemo(() => {
//     const t = Math.max(0, Math.min(1, intensity));
//     return Math.pow(t, 1.4);
//   }, [intensity]);

//   // opacity ramps with intensity
//   const opacity = active ? 0.08 + eased * 0.22 : 0; // ~0 → 0.3
//   // speed increases near the end (lower duration = faster)
//   const baseDur = 22000;
//   const minDur = 10000;
//   const dur = baseDur - (baseDur - minDur) * eased;

//   useEffect(() => {
//     const el1 = layer1Ref.current;
//     const el2 = layer2Ref.current;
//     if (!el1 || !el2) return;

//     // Stop previous animations
//     el1.getAnimations().forEach(a => a.cancel());
//     el2.getAnimations().forEach(a => a.cancel());

//     if (!active) return;

//     // Gentle drift
//     el1.animate(
//       [
//         { transform: 'translate3d(-3%, -2%, 0) scale(1)' },
//         { transform: 'translate3d(3%, 2%, 0) scale(1.03)' },
//         { transform: 'translate3d(-3%, -2%, 0) scale(1)' },
//       ],
//       { duration: dur, iterations: Infinity, easing: 'linear' }
//     );

//     // Counter drift
//     el2.animate(
//       [
//         { transform: 'translate3d(2%, 1%, 0) scale(1)' },
//         { transform: 'translate3d(-2%, -1%, 0) scale(1.04)' },
//         { transform: 'translate3d(2%, 1%, 0) scale(1)' },
//       ],
//       { duration: dur * 1.35, iterations: Infinity, easing: 'ease-in-out' }
//     );
//   }, [active, dur]);

//   return (
//     <div
//       aria-hidden
//       className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
//       style={{ opacity, transition: 'opacity 500ms ease' }}
//     >
//       {/* layer 1 */}
//       <div
//         ref={layer1Ref}
//         className="absolute -inset-[25%] blur-3xl"
//         style={{
//           background:
//             'radial-gradient(60% 60% at 20% 20%, rgba(125, 211, 252, 0.35) 0%, rgba(255,255,255,0) 60%), radial-gradient(55% 55% at 75% 30%, rgba(196, 181, 253, 0.35) 0%, rgba(255,255,255,0) 60%), radial-gradient(50% 50% at 40% 85%, rgba(244, 114, 182, 0.25) 0%, rgba(255,255,255,0) 60%)',
//         }}
//       />
//       {/* layer 2 */}
//       <div
//         ref={layer2Ref}
//         className="absolute -inset-[30%] blur-3xl"
//         style={{
//           background:
//             'radial-gradient(55% 55% at 80% 20%, rgba(99, 102, 241, 0.30) 0%, rgba(255,255,255,0) 60%), radial-gradient(55% 55% at 30% 70%, rgba(14, 165, 233, 0.25) 0%, rgba(255,255,255,0) 60%)',
//           mixBlendMode: 'screen',
//         }}
//       />
//     </div>
//   );
// }
