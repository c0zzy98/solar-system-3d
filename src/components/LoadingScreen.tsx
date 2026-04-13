import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const LOADING_STATUSES = [
  'INICJALIZACJA SYSTEMU...',
  'KALIBRACJA ORBIT...',
  'ŁADOWANIE DANYCH GWIEZDNYCH...',
  'SYNCHRONIZACJA TELEMETRII...',
  'RENDEROWANIE UKŁADU SŁONECZNEGO...',
  'SYSTEM GOTOWY',
]

const LOADING_ORBITS: { r: number; color: string; dur: number; dot: number; start: number }[] = [
  { r: 38,  color: '#b7a18a', dur: 2.2,  dot: 3,   start: 45  },
  { r: 62,  color: '#3b82f6', dur: 4.0,  dot: 4,   start: 130 },
  { r: 84,  color: '#c2410c', dur: 6.0,  dot: 3.5, start: 210 },
  { r: 108, color: '#c88b3a', dur: 10.0, dot: 6,   start: 290 },
  { r: 132, color: '#c8a96e', dur: 16.0, dot: 5,   start: 60  },
]

const LOADING_CSS =
  LOADING_ORBITS.map(
    (o, i) =>
      `@keyframes ls-orbit-${i}{from{transform:rotate(${o.start}deg) translateX(${o.r}px)}to{transform:rotate(${o.start + 360}deg) translateX(${o.r}px)}}`,
  ).join('') +
  `@keyframes ls-pulse{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.13)}}` +
  `@keyframes ls-scanline{0%{top:-4px;opacity:.65}85%{opacity:.65}100%{top:100%;opacity:0}}` +
  `@keyframes ls-breathe{0%,100%{opacity:.28}50%{opacity:.65}}` +
  `@keyframes ls-flicker{0%,92%,96%,100%{opacity:1}93%,97%{opacity:.7}}`

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const DURATION = 3000
    const start = performance.now()
    let rafId: number
    const tick = () => {
      const elapsed = performance.now() - start
      const t = Math.min(elapsed / DURATION, 1)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        setTimeout(onDone, 500)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [onDone])

  const statusIdx = Math.min(
    Math.floor((progress / 100) * LOADING_STATUSES.length),
    LOADING_STATUSES.length - 1,
  )

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#02050b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <style>{LOADING_CSS}</style>

      {/* Scan line */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent 0%,rgba(56,189,248,0.5) 30%,rgba(56,189,248,0.5) 70%,transparent 100%)',
          animation: 'ls-scanline 3.2s linear infinite',
        }} />
      </div>

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(56,189,248,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.035) 1px,transparent 1px)',
        backgroundSize: '44px 44px',
        animation: 'ls-breathe 4s ease-in-out infinite',
      }} />

      {/* Corner labels */}
      {[
        { t: 32, l: 40, text: 'SYS // v2.1.0' },
        { t: 32, r: 40, text: 'ORBIT CALC ACTIVE' },
        { b: 32, l: 40, text: `LAT: ${new Date().getFullYear()}` },
        { b: 32, r: 40, text: 'SOL-SYSTEM // 3D' },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 'b' in c ? undefined : c.t,
          bottom: 'b' in c ? c.b : undefined,
          left: 'l' in c ? c.l : undefined,
          right: 'r' in c ? c.r : undefined,
          color: 'rgba(56,189,248,0.28)',
          fontFamily: 'monospace',
          fontSize: 10,
          letterSpacing: '0.2em',
          animation: 'ls-flicker 5s ease-in-out infinite',
          animationDelay: `${i * 1.1}s`,
        }}>{c.text}</div>
      ))}

      {/* Mini solar system */}
      <div style={{ position: 'relative', width: 300, height: 300, marginBottom: 36, flexShrink: 0 }}>
        {LOADING_ORBITS.map((o, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: o.r * 2, height: o.r * 2,
            marginTop: -o.r, marginLeft: -o.r,
            borderRadius: '50%',
            border: `1px solid ${o.color}28`,
          }} />
        ))}
        {/* Sun */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 22, height: 22, marginTop: -11, marginLeft: -11,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 42% 38%,#fff7d0 0%,#fbbf24 40%,#b45309 100%)',
          boxShadow: '0 0 20px 8px rgba(245,158,11,0.45),0 0 40px 16px rgba(245,158,11,0.18)',
          animation: 'ls-pulse 2.4s ease-in-out infinite',
        }} />
        {/* Planets */}
        {LOADING_ORBITS.map((o, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: o.dot * 2, height: o.dot * 2,
            marginTop: -o.dot, marginLeft: -o.dot,
            borderRadius: '50%',
            background: o.color,
            boxShadow: `0 0 ${o.dot * 3}px ${o.color}bb`,
            animation: `ls-orbit-${i} ${o.dur}s linear infinite`,
          }} />
        ))}
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', zIndex: 1, width: 300 }}>
        <p style={{
          fontFamily: "'Orbitron', ui-monospace, monospace",
          fontSize: 10, letterSpacing: '0.5em',
          color: 'rgba(56,189,248,0.55)',
          textTransform: 'uppercase', marginBottom: 6,
        }}>EKSPLORACJA KOSMOSU</p>
        <h1 style={{
          fontFamily: "'Orbitron', ui-monospace, monospace",
          fontSize: 26, fontWeight: 700,
          letterSpacing: '0.15em',
          color: 'white',
          textTransform: 'uppercase',
          marginBottom: 28,
          textShadow: '0 0 32px rgba(56,189,248,0.4)',
          animation: 'ls-flicker 7s ease-in-out infinite',
        }}>
          Solar System<br />
          <span style={{ fontSize: 18, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.55)' }}>3D</span>
        </h1>

        {/* Progress bar */}
        <div style={{
          width: '100%', height: 2,
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 1, marginBottom: 10, overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            background: 'linear-gradient(90deg,#38bdf8,#818cf8)',
            borderRadius: 1,
            boxShadow: '0 0 10px rgba(56,189,248,0.75)',
            transition: 'width 0.06s linear',
          }} />
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.08em',
        }}>
          <span style={{ color: 'rgba(56,189,248,0.7)' }}>{LOADING_STATUSES[statusIdx]}</span>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>{progress}%</span>
        </div>
      </div>
    </motion.div>
  )
}
