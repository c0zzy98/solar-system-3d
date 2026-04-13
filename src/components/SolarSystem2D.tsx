import React, { useCallback, useEffect, useRef } from 'react'
import type { PlanetData, PlanetId } from '../data/planets'
import { MOON_ORBIT_RADIUS, MOON_PLANET_DATA, ORBIT_PLANETS } from '../data/planets'

const SAT_TARGETS_2D = [
  { id: 'moon'         as PlanetId, label: 'Księżyc',     color: '#93c5fd', km: '384 400 km',   light: '~1,28 s świetlnych' },
  { id: 'new-horizons' as PlanetId, label: 'New Horizons', color: '#818cf8', km: '~8,7 mld km',  light: '~8,05 h świetlnych' },
  { id: 'voyager2'     as PlanetId, label: 'Voyager 2',    color: '#34d399', km: '~20,3 mld km', light: '~18,9 h świetlnych' },
  { id: 'voyager1'     as PlanetId, label: 'Voyager 1',    color: '#a78bfa', km: '~24,4 mld km', light: '~22,6 h świetlnych' },
]

export function SolarSystem2D({
  activePlanetId,
  onPlanetClick,
  isRunningRef,
  showEarthSatellites = false,
}: {
  activePlanetId: PlanetId | null
  onPlanetClick: (id: PlanetId) => void
  isRunningRef: React.MutableRefObject<boolean>
  showEarthSatellites?: boolean
}) {
  const canvasRef          = useRef<HTMLCanvasElement>(null)
  const animRef            = useRef(0)
  const anglesRef          = useRef<Partial<Record<PlanetId, number>>>({})
  const moonAngleRef       = useRef(Math.random() * Math.PI * 2)
  const activeRef          = useRef(activePlanetId)
  const showSatellitesRef  = useRef(showEarthSatellites)
  const posRef             = useRef<Partial<Record<PlanetId, { x: number; y: number; r: number }>>>({})
  const lastTSRef          = useRef<number | null>(null)
  const imgsRef      = useRef<Partial<Record<PlanetId, HTMLImageElement>>>({})

  useEffect(() => { activeRef.current = activePlanetId }, [activePlanetId])
  useEffect(() => { showSatellitesRef.current = showEarthSatellites }, [showEarthSatellites])

  useEffect(() => {
    ORBIT_PLANETS.concat([MOON_PLANET_DATA]).forEach(p => {
      if (p.texturePath && !imgsRef.current[p.id]) {
        const img = new Image()
        img.src = p.texturePath
        imgsRef.current[p.id] = img
      }
    })
    ORBIT_PLANETS.forEach(p => {
      if (!(p.id in anglesRef.current)) {
        anglesRef.current[p.id] = Math.random() * Math.PI * 2
      }
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // precompute stable references used every frame
    const nonSunPlanets   = ORBIT_PLANETS.filter(p => p.id !== 'sun' && !p.isProbe)
    const probePlanets    = ORBIT_PLANETS.filter(p => p.isProbe)
    const sunPlanet       = ORBIT_PLANETS.find(p => p.id === 'sun')!
    const earthOrbitR     = ORBIT_PLANETS.find(p => p.id === 'earth')!.orbitRadius!

    const drawBody = (
      p: PlanetData,
      px: number, py: number, pr: number,
      isActive: boolean, dpr: number,
    ) => {
      // ── Probe rendering ──────────────────────────────────────────────
      if (p.isProbe) {
        const s = pr * 1.8
        ctx.save()
        // Active ring
        if (isActive) {
          ctx.beginPath()
          ctx.arc(px, py, s + 4 * dpr, 0, Math.PI * 2)
          ctx.strokeStyle = p.color + 'aa'
          ctx.lineWidth   = 1.5 * dpr
          ctx.stroke()
        }
        // Diamond outline
        ctx.beginPath()
        ctx.moveTo(px,       py - s)
        ctx.lineTo(px + s,   py)
        ctx.lineTo(px,       py + s)
        ctx.lineTo(px - s,   py)
        ctx.closePath()
        ctx.strokeStyle = p.color
        ctx.lineWidth   = 1.5 * dpr
        ctx.stroke()
        ctx.fillStyle = p.color + '30'
        ctx.fill()
        // Cross-hair centre
        ctx.beginPath()
        ctx.moveTo(px - s * 0.5, py)
        ctx.lineTo(px + s * 0.5, py)
        ctx.moveTo(px, py - s * 0.5)
        ctx.lineTo(px, py + s * 0.5)
        ctx.strokeStyle = p.color + 'cc'
        ctx.lineWidth   = dpr
        ctx.stroke()
        // Label
        ctx.font      = `${Math.round(9 * dpr)}px monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = isActive ? p.color : p.color + 'bb'
        ctx.fillText(p.name.toUpperCase(), px, py + s + 12 * dpr)
        ctx.restore()
        return
      }

      // ── Regular planet rendering ──────────────────────────────────────
      if (isActive) {
        ctx.beginPath()
        ctx.arc(px, py, pr + 5 * dpr, 0, Math.PI * 2)
        ctx.strokeStyle = p.color + 'bb'
        ctx.lineWidth   = 1.5 * dpr
        ctx.stroke()
      }

      ctx.save()
      ctx.beginPath()
      ctx.arc(px, py, pr, 0, Math.PI * 2)
      ctx.clip()

      const img = imgsRef.current[p.id]
      if (img?.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, px - pr, py - pr, pr * 2, pr * 2)
        const shade = ctx.createRadialGradient(px + pr * 0.3, py - pr * 0.3, 0, px, py, pr)
        shade.addColorStop(0,   'rgba(0,0,0,0)')
        shade.addColorStop(0.5, 'rgba(0,0,0,0.12)')
        shade.addColorStop(1,   'rgba(0,0,0,0.60)')
        ctx.fillStyle = shade
        ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2)
      } else {
        const colors = p.gradientColors ?? [p.color, p.color]
        const grad = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.35, 0, px, py, pr)
        grad.addColorStop(0, colors[0])
        grad.addColorStop(1, colors[colors.length - 1])
        ctx.fillStyle = grad
        ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2)
      }
      ctx.restore()

      if (p.id === 'sun') {
        ctx.beginPath()
        ctx.arc(px, py, pr * 1.55, 0, Math.PI * 2)
        const glow = ctx.createRadialGradient(px, py, pr * 0.9, px, py, pr * 1.55)
        glow.addColorStop(0, 'rgba(255,200,60,0.22)')
        glow.addColorStop(1, 'rgba(255,100,0,0)')
        ctx.fillStyle = glow
        ctx.fill()
      }

      if (p.id === 'saturn') {
        ctx.save()
        ctx.translate(px, py)
        ctx.scale(1, 0.28)
        ctx.beginPath()
        ctx.arc(0, 0, pr * 2.0, 0, Math.PI * 2)
        ctx.strokeStyle = '#c8a96e55'
        ctx.lineWidth   = pr * 0.7
        ctx.stroke()
        ctx.restore()
      }

      ctx.font      = `${Math.round(10 * dpr)}px Orbitron, ui-monospace, monospace`
      ctx.textAlign = 'center'
      ctx.fillStyle = isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)'
      ctx.fillText(p.name.toUpperCase(), px, py + pr + 13 * dpr)
    }

    const draw = (ts: number) => {
      const delta = lastTSRef.current !== null
        ? Math.min((ts - lastTSRef.current) / 1000, 0.05)
        : 0
      lastTSRef.current = ts

      const w   = canvas.width
      const h   = canvas.height
      const dpr = window.devicePixelRatio
      const cx  = w / 2
      const cy  = h / 2
      const scale = Math.min(w, h) * 0.45 / 18.8

      ctx.clearRect(0, 0, w, h)

      // update orbit angles
      ORBIT_PLANETS.forEach(p => {
        if (p.orbitRadius && p.orbitSpeed && isRunningRef.current) {
          anglesRef.current[p.id] = (anglesRef.current[p.id] ?? 0) + delta * p.orbitSpeed
        }
      })
      if (isRunningRef.current) moonAngleRef.current += delta * 0.42

      const earthAngle = anglesRef.current['earth'] ?? 0
      const ePx = cx + Math.cos(earthAngle) * earthOrbitR * scale
      const ePy = cy + Math.sin(earthAngle) * earthOrbitR * scale

      // orbit rings
      ORBIT_PLANETS.filter(p => p.orbitRadius).forEach(p => {
        ctx.beginPath()
        ctx.arc(cx, cy, p.orbitRadius! * scale, 0, Math.PI * 2)
        ctx.strokeStyle = p.color + '22'
        ctx.lineWidth   = 1
        ctx.stroke()
      })
      // moon orbit ring (follows Earth)
      ctx.beginPath()
      ctx.arc(ePx, ePy, MOON_ORBIT_RADIUS * scale, 0, Math.PI * 2)
      ctx.strokeStyle = '#c8c8d820'
      ctx.lineWidth   = 1
      ctx.stroke()

      const active = activeRef.current

      // non-sun orbiting planets
      nonSunPlanets.forEach(p => {
        const a  = anglesRef.current[p.id] ?? 0
        const ox = p.orbitRadius! * scale
        const px = cx + Math.cos(a) * ox
        const py = cy + Math.sin(a) * ox
        const pr = Math.max(4 * dpr, p.size * scale * 0.68)
        posRef.current[p.id] = { x: px, y: py, r: pr }
        drawBody(p, px, py, pr, active === p.id, dpr)
      })

      // Probes — fixed positions, scaled to half the visible radius max
      {
        const probeScale = Math.min(w, h) * 0.48 / 42
        probePlanets.forEach(p => {
          const [px3, , pz3] = p.position
          const ppx = cx + px3 * probeScale
          const ppy = cy + pz3 * probeScale
          const pr  = Math.max(5 * dpr, p.size * probeScale * 0.9)
          posRef.current[p.id] = { x: ppx, y: ppy, r: pr }
          drawBody(p, ppx, ppy, pr, active === p.id, dpr)
        })
      }

      // Moon (orbits Earth)
      const ma     = moonAngleRef.current
      const moonPx = ePx + Math.cos(ma) * MOON_ORBIT_RADIUS * scale
      const moonPy = ePy + Math.sin(ma) * MOON_ORBIT_RADIUS * scale
      const moonR  = Math.max(3 * dpr, MOON_PLANET_DATA.size * scale * 0.68)
      posRef.current['moon'] = { x: moonPx, y: moonPy, r: moonR }
      drawBody(MOON_PLANET_DATA, moonPx, moonPy, moonR, active === 'moon', dpr)

      // ── Satellite lines (Earth → Księżyc / probes) ──────────────────
      if (showSatellitesRef.current) {
        const earthPos = posRef.current['earth']
        if (earthPos) {
          SAT_TARGETS_2D.forEach(({ id, label, color, km, light }) => {
            const tPos = posRef.current[id]
            if (!tPos) return
            // dashed line
            ctx.save()
            ctx.setLineDash([6 * dpr, 3 * dpr])
            ctx.beginPath()
            ctx.moveTo(earthPos.x, earthPos.y)
            ctx.lineTo(tPos.x, tPos.y)
            ctx.strokeStyle = color + 'aa'
            ctx.lineWidth   = 1.2 * dpr
            ctx.stroke()
            ctx.restore()
            // label box at midpoint
            const lx      = (earthPos.x + tPos.x) / 2
            const ly      = (earthPos.y + tPos.y) / 2
            const fs      = 9 * dpr
            const lineH   = 13 * dpr
            const pad     = 5 * dpr
            ctx.font = `${Math.round(fs)}px monospace`
            ctx.textAlign = 'center'
            const w1  = ctx.measureText(label).width
            const w2  = ctx.measureText(km).width
            const w3  = ctx.measureText(light).width
            const bW  = Math.max(w1, w2, w3) + pad * 2
            const bH  = lineH * 3 + pad * 2
            const bX  = lx - bW / 2
            const bY  = ly - bH / 2 - 6 * dpr
            ctx.fillStyle   = 'rgba(2,5,11,0.88)'
            ctx.strokeStyle = color + '44'
            ctx.lineWidth   = dpr
            ctx.beginPath()
            ;(ctx as CanvasRenderingContext2D & { roundRect: (x:number,y:number,w:number,h:number,r:number)=>void }).roundRect(bX, bY, bW, bH, 4 * dpr)
            ctx.fill()
            ctx.stroke()
            ctx.fillStyle = color
            ctx.fillText(label, lx, bY + pad + lineH * 0.8)
            ctx.fillStyle = 'rgba(255,255,255,0.82)'
            ctx.fillText(km, lx, bY + pad + lineH * 1.8)
            ctx.fillStyle = color + '88'
            ctx.fillText(light, lx, bY + pad + lineH * 2.8)
          })
        }
      }

      // Sun drawn last so its glow sits on top
      const sunR = Math.max(8 * dpr, sunPlanet.size * scale * 0.68)
      posRef.current['sun'] = { x: cx, y: cy, r: sunR }
      drawBody(sunPlanet, cx, cy, sunR, active === 'sun', dpr)

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio
    const mx   = (e.clientX - rect.left) * dpr
    const my   = (e.clientY - rect.top)  * dpr

    const ids: PlanetId[] = [...ORBIT_PLANETS.map(p => p.id as PlanetId), 'moon']
    for (const id of ids) {
      const pos = posRef.current[id]
      if (!pos) continue
      const dx   = mx - pos.x
      const dy   = my - pos.y
      const hitR = Math.max(pos.r + 8 * dpr, 18 * dpr)
      if (dx * dx + dy * dy <= hitR * hitR) {
        onPlanetClick(id)
        return
      }
    }
  }, [onPlanetClick])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio
    const mx   = (e.clientX - rect.left) * dpr
    const my   = (e.clientY - rect.top)  * dpr

    const ids: PlanetId[] = [...ORBIT_PLANETS.map(p => p.id as PlanetId), 'moon']
    for (const id of ids) {
      const pos = posRef.current[id]
      if (!pos) continue
      const dx   = mx - pos.x
      const dy   = my - pos.y
      const hitR = Math.max(pos.r + 8 * dpr, 18 * dpr)
      if (dx * dx + dy * dy <= hitR * hitR) {
        canvas.style.cursor = 'pointer'
        return
      }
    }
    canvas.style.cursor = 'default'
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    />
  )
}
