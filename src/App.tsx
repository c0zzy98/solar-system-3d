import { Canvas } from '@react-three/fiber'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PLANETS, type PlanetId } from './data/planets'
import { LoadingScreen } from './components/LoadingScreen'
import { PlanetPreview, PlanetStoryOverlay } from './components/PlanetStoryOverlay'
import { SolarSystem2D } from './components/SolarSystem2D'
import { Scene } from './components/Scene3D'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [activePlanetId, setActivePlanetId] = useState<PlanetId | null>(null)
  const [storyPlanetId, setStoryPlanetId] = useState<PlanetId | null>(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.07)
  const [is2D, setIs2D] = useState(false)
  const [isRunning, setIsRunning] = useState(true)
  const isRunningRef = useRef(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const handleLoadDone = useCallback(() => setLoaded(true), [])

  const toggleRunning = useCallback(() => {
    isRunningRef.current = !isRunningRef.current
    setIsRunning(v => !v)
  }, [])

  useEffect(() => {
    const audio = new Audio('/ambient/loop.mp3.mp3')
    audio.loop = true
    audio.volume = 0.07
    audioRef.current = audio
    const play = () => { audio.play().catch(() => {}) }
    audio.play().catch(() => {
      document.addEventListener('click', play, { once: true })
    })
    return () => {
      audio.pause()
      document.removeEventListener('click', play)
    }
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.volume = volume
      audio.play().catch(() => {})
      setMuted(false)
    } else {
      audio.volume = 0
      audio.pause()
      setMuted(true)
    }
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    const audio = audioRef.current
    if (!audio) return
    audio.volume = v
    if (v > 0 && muted) {
      audio.play().catch(() => {})
      setMuted(false)
    } else if (v === 0 && !muted) {
      setMuted(true)
    }
  }

  const activePlanet =
    PLANETS.find((planet) => planet.id === activePlanetId) ?? null
  const storyPlanet =
    PLANETS.find((planet) => planet.id === storyPlanetId) ?? null

  return (
    <div className="min-h-screen bg-[#02050b] text-white">
      <AnimatePresence>
        {!loaded && <LoadingScreen onDone={handleLoadDone} />}
      </AnimatePresence>
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(1,3,8,0.76),rgba(4,8,18,0.78),rgba(2,5,11,0.96))]" />
      </div>

      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute left-6 top-6 z-10">
          <p className="text-xs uppercase tracking-[0.45em] text-white/55">
            Solar System {is2D ? '2D' : '3D'}
          </p>
        </div>



        {is2D ? (
          <SolarSystem2D
            activePlanetId={activePlanetId}
            onPlanetClick={setActivePlanetId}
            isRunningRef={isRunningRef}
          />
        ) : (
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 10, 16], fov: 45 }}
          >
            <Scene activePlanetId={activePlanetId} onPlanetClick={setActivePlanetId} hideLabels={storyPlanetId !== null} isRunningRef={isRunningRef} />
          </Canvas>
        )}

        {/* Mute / volume control — bottom-left */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
          <button
            onClick={toggleMute}
            title={muted ? 'Włącz muzykę' : 'Wycisz muzykę'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/60 backdrop-blur-md transition hover:border-white/35 hover:text-white/90"
          >
            {muted || volume === 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : volume < 0.4 ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
          <div className="flex h-10 items-center rounded-full border border-white/15 bg-black/50 px-3 backdrop-blur-md">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-white/70"
              title="Głośność"
            />
          </div>
        </div>

        {/* 2D / 3D toggle */}
        <button
          onClick={() => { setIs2D(v => !v); setActivePlanetId(null) }}
          title={is2D ? 'Przełącz na tryb 3D' : 'Przełącz na tryb 2D'}
          className="absolute bottom-6 left-52 z-20 flex h-10 items-center rounded-full border border-white/15 bg-black/50 px-4 text-[11px] font-medium uppercase tracking-[0.25em] text-white/60 backdrop-blur-md transition hover:border-white/35 hover:text-white/90"
        >
          {is2D ? '3D' : '2D'}
        </button>

        {/* Start / Pause animation */}
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex gap-2">
          <button
            onClick={toggleRunning}
            title={isRunning ? 'Zatrzymaj obrót' : 'Wznów obrót'}
            className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-black/50 px-5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/60 backdrop-blur-md transition hover:border-white/35 hover:text-white/90"
          >
            {isRunning ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {activePlanet && (
            <motion.aside
              key="planet-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 220 }}
              className="absolute right-0 top-0 z-10 h-full w-full max-w-xs overflow-y-auto border-l border-white/10 bg-black/70 backdrop-blur-md sm:max-w-sm"
            >
              <div className="flex flex-col gap-5 px-6 pb-10 pt-8">
                {/* Header row: back button + label */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActivePlanetId(null)}
                    className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.35em] text-white/45 transition-colors hover:text-white/90"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Powrót
                  </button>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
                    Aktywna planeta
                  </p>
                </div>

                <div>
                  <h2 className="font-orbitron text-3xl font-bold uppercase tracking-[0.06em]">
                    {activePlanet.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/65">
                    {activePlanet.subtitle}
                  </p>
                </div>

                <PlanetPreview planet={activePlanet} />

                <p className="text-sm leading-7 text-white/60">
                  {activePlanet.description}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {activePlanet.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <p className="text-[9px] uppercase tracking-[0.3em] text-white/38">
                        {stat.label}
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-white/90">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-white/38">
                    Ciekawostka
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {activePlanet.fact}
                  </p>
                </div>

                <button
                  onClick={() => setStoryPlanetId(activePlanet.id)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/6 py-3 text-sm font-medium tracking-[0.06em] text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Odkryj historię →
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {storyPlanet && (
            <PlanetStoryOverlay
              planet={storyPlanet}
              onClose={() => setStoryPlanetId(null)}
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
