import React from 'react'
import { motion } from 'framer-motion'
import type { PlanetData, HabitabilityRating } from '../data/planets'

export function PlanetCSSSphere({ planet, size }: { planet: PlanetData; size: number }) {
  const shading = 'radial-gradient(ellipse at 68% 32%, transparent 20%, rgba(0,0,0,0.70) 100%)'

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
    boxShadow: `0 0 ${Math.round(size * 0.35)}px ${planet.color}55`,
  }

  if (planet.texturePath) {
    return (
      <div style={baseStyle}>
        <img
          src={planet.texturePath}
          alt={planet.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: shading, borderRadius: '50%' }} />
      </div>
    )
  }

  const colors = planet.gradientColors ?? [planet.color, planet.color]
  const mid    = colors[Math.floor(colors.length / 2)] ?? colors[0]
  const end    = colors[colors.length - 1] ?? colors[0]
  return (
    <div style={{
      ...baseStyle,
      background: `radial-gradient(ellipse at 42% 32%, ${mid}, ${colors[0]} 55%, ${end} 100%)`,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: shading, borderRadius: '50%' }} />
    </div>
  )
}

export function PlanetPreview({ planet }: { planet: PlanetData }) {
  if (planet.probeImagePath) {
    return (
      <div className="overflow-hidden rounded-xl" style={{ boxShadow: `0 0 28px ${planet.color}44` }}>
        <img
          src={planet.probeImagePath}
          alt={planet.name}
          className="w-full object-cover"
          style={{ maxHeight: 180 }}
        />
      </div>
    )
  }
  const size = planet.id === 'sun' ? 140 : 120
  return <PlanetCSSSphere planet={planet} size={size} />
}

export function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-[10px] uppercase tracking-[0.45em] text-white/35">{label}</p>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

export const RATING_CLASS: Record<HabitabilityRating, string> = {
  good: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  ok: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  bad: 'text-red-400 border-red-500/30 bg-red-500/10',
}

export function PlanetStoryOverlay({
  planet,
  onClose,
}: {
  planet: PlanetData
  onClose: () => void
}) {
  return (
    <motion.div
      key={planet.id + '-story'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#02050b]/95 backdrop-blur-xl"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/6 text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-4 pt-20 text-center"
      >
        <div
          className="mb-6"
          style={{ boxShadow: `0 0 80px ${planet.color}44`, borderRadius: '50%' }}
        >
          <PlanetCSSSphere planet={planet} size={160} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-white/35">
          Historia i parametry
        </p>
        <h1 className="font-orbitron mt-2 text-4xl font-bold uppercase tracking-[0.06em]">
          {planet.name}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-white/55">
          {planet.subtitle}
        </p>
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-16 px-6 pb-24 pt-10">

        {/* Discovery timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionHeader label="Historia odkrycia" />
          <div className="mt-6">
            {planet.story.discovery.map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: planet.color }}
                  />
                  {i < planet.story.discovery.length - 1 && (
                    <div className="w-px flex-1 bg-white/10" />
                  )}
                </div>
                <div className="pb-8">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.3em]"
                    style={{ color: planet.color }}
                  >
                    {item.year}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/65">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Habitability */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader label="Możliwość zamieszkania" />
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                  Indeks zamieszkiwalności
                </p>
                <p className="mt-1 text-5xl font-semibold tabular-nums">
                  {planet.story.habitability.score}
                  <span className="ml-1 text-2xl text-white/35">/ 100</span>
                </p>
                <p className="mt-1 text-sm text-white/55">
                  {planet.story.habitability.label}
                </p>
              </div>
              <div className="relative h-4 w-44 overflow-hidden rounded-full bg-white/6">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${planet.color}88, ${planet.color})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${planet.story.habitability.score}%` }}
                  transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {planet.story.habitability.factors.map((f) => (
                <div
                  key={f.name}
                  className={`rounded-xl border p-3 ${RATING_CLASS[f.rating]}`}
                >
                  <p className="text-[9px] uppercase tracking-[0.28em] opacity-60">
                    {f.name}
                  </p>
                  <p className="mt-1 text-xs font-medium">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Gallery */}
        {planet.story.images.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SectionHeader label="Galeria" />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {planet.story.images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/10"
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="h-52 w-full object-cover"
                  />
                  <p className="px-4 py-2.5 text-[11px] text-white/40">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

      </div>
    </motion.div>
  )
}
