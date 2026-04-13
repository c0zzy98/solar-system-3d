import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TWINKLE_VERT, TWINKLE_FRAG, COMET_VERT, COMET_FRAG } from '../shaders'

export function MilkyWayBackground() {
  const texture = useTexture('/textures/milkyway.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 16
  texture.needsUpdate = true
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[190, 128, 128]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

export function ParallaxStars() {
  const groupRef = useRef<THREE.Group>(null)
  const matRef   = useRef<THREE.ShaderMaterial>(null)

  const { pts } = useMemo(() => {
    const N = 1500
    const pos   = new Float32Array(N * 3)
    const phase = new Float32Array(N)
    const freq  = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 50 + Math.random() * 35
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)
      phase[i]   = Math.random() * Math.PI * 2
      freq[i]    = 0.4 + Math.random() * 1.8
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos,   3))
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phase, 1))
    geo.setAttribute('aFreq',    new THREE.BufferAttribute(freq,  1))

    const mat = new THREE.ShaderMaterial({
      vertexShader:   TWINKLE_VERT,
      fragmentShader: TWINKLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { time: { value: 0 } },
    })

    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    return { pts: points }
  }, [])

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.006
      groupRef.current.rotation.x += delta * 0.002
    }
    if (matRef.current) {
      matRef.current.uniforms.time.value = clock.getElapsedTime()
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={pts}>
        <primitive object={(pts.material as THREE.ShaderMaterial)} ref={matRef} attach="material" />
      </primitive>
    </group>
  )
}

export function SunGlow() {
  const spriteRef = useRef<THREE.Sprite>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0,    'rgba(255, 240, 140, 0.95)')
    g.addColorStop(0.12, 'rgba(255, 190, 60, 0.6)')
    g.addColorStop(0.35, 'rgba(255, 130, 20, 0.18)')
    g.addColorStop(0.65, 'rgba(255, 90, 0, 0.05)')
    g.addColorStop(1,    'rgba(0, 0, 0, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ clock }) => {
    if (spriteRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.65) * 0.055
      spriteRef.current.scale.setScalar(8.5 * pulse)
    }
  })

  return (
    <sprite ref={spriteRef} scale={[8.5, 8.5, 8.5]}>
      <spriteMaterial
        map={texture}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </sprite>
  )
}

// ─── Shooting Comets ──────────────────────────────────────────────────────

const MAX_COMETS = 7
const TAIL_PTS   = 22

type CometState = {
  active: boolean
  head: THREE.Vector3
  dir: THREE.Vector3
  speed: number
  life: number
  duration: number
  tailExtent: number
}

export function ShootingComets() {
  const totalPts = MAX_COMETS * TAIL_PTS

  const data = useMemo(() => {
    const pos   = new Float32Array(totalPts * 3)
    const alpha = new Float32Array(totalPts)
    const size  = new Float32Array(totalPts)
    const brite = new Float32Array(totalPts)

    const posAttr   = new THREE.BufferAttribute(pos,   3); posAttr.usage   = THREE.DynamicDrawUsage
    const alphaAttr = new THREE.BufferAttribute(alpha, 1); alphaAttr.usage = THREE.DynamicDrawUsage
    const sizeAttr  = new THREE.BufferAttribute(size,  1); sizeAttr.usage  = THREE.DynamicDrawUsage
    const briteAttr = new THREE.BufferAttribute(brite, 1); briteAttr.usage = THREE.DynamicDrawUsage

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position',    posAttr)
    geo.setAttribute('aAlpha',      alphaAttr)
    geo.setAttribute('aSize',       sizeAttr)
    geo.setAttribute('aBrightness', briteAttr)

    const mat = new THREE.ShaderMaterial({
      vertexShader:   COMET_VERT,
      fragmentShader: COMET_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false

    return { pos, alpha, size, brite, posAttr, alphaAttr, sizeAttr, briteAttr, pts }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const comets = useRef<CometState[]>(
    Array.from({ length: MAX_COMETS }, () => ({
      active: false,
      head: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      speed: 0, life: 0, duration: 1, tailExtent: 0,
    }))
  )
  const spawnTimer = useRef(0.4)

  const spawnComet = () => {
    const idx = comets.current.findIndex(c => !c.active)
    if (idx === -1) return
    const c = comets.current[idx]

    const phi   = Math.acos(2 * Math.random() - 1)
    const theta = Math.random() * Math.PI * 2
    const r     = 44 + Math.random() * 24
    c.head.set(
      r * Math.sin(phi) * Math.cos(theta),
      (Math.random() - 0.5) * 24,
      r * Math.sin(phi) * Math.sin(theta),
    )

    const t1 = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta))
    t1.x += (Math.random() - 0.5) * 0.35
    t1.y += (Math.random() - 0.5) * 0.35
    t1.z += (Math.random() - 0.5) * 0.35
    t1.normalize()
    c.dir.copy(t1)

    c.speed      = 4 + Math.random() * 5
    c.duration   = (18 + Math.random() * 14) / c.speed
    c.tailExtent = 2 + Math.random() * 2.5
    c.life   = 0
    c.active = true
  }

  useFrame((_, delta) => {
    spawnTimer.current -= delta
    if (spawnTimer.current <= 0) {
      spawnComet()
      spawnTimer.current = 3.0 + Math.random() * 5.0
    }

    for (const c of comets.current) {
      if (!c.active) continue
      c.life += delta / c.duration
      c.head.addScaledVector(c.dir, delta * c.speed)
      if (c.life >= 1) c.active = false
    }

    for (let i = 0; i < MAX_COMETS; i++) {
      const c = comets.current[i]
      for (let j = 0; j < TAIL_PTS; j++) {
        const bi = i * TAIL_PTS + j
        if (!c.active) {
          data.pos[bi * 3 + 1] = -99999
          data.alpha[bi] = 0
          data.size[bi]  = 0
          continue
        }
        const t = j / (TAIL_PTS - 1)
        data.pos[bi*3]   = c.head.x - c.dir.x * t * c.tailExtent
        data.pos[bi*3+1] = c.head.y - c.dir.y * t * c.tailExtent
        data.pos[bi*3+2] = c.head.z - c.dir.z * t * c.tailExtent

        const lifeFade = Math.min(c.life / 0.10, 1) * Math.min((1 - c.life) / 0.13, 1)
        const tailFade = Math.pow(1 - t, 1.5)
        data.alpha[bi] = Math.max(0, lifeFade * tailFade * 0.62)
        data.size[bi]  = j === 0 ? 3.2 : (1 - t) * 2.0 + 0.3
        data.brite[bi] = 1 - t
      }
    }

    data.posAttr.needsUpdate   = true
    data.alphaAttr.needsUpdate = true
    data.sizeAttr.needsUpdate  = true
    data.briteAttr.needsUpdate = true
  })

  return <primitive object={data.pts} />
}

export function NebulaLayer() {
  const groupRef = useRef<THREE.Group>(null)

  const sprites = useMemo(() => {
    const defs: { pos: [number, number, number]; color: string; size: number; opacity: number }[] = [
      { pos: [ 55,  12, -35], color: '#2d1880', size: 90,  opacity: 0.055 },
      { pos: [-45, -18, -55], color: '#104878', size: 105, opacity: 0.048 },
      { pos: [ 18, -28,  72], color: '#441870', size: 95,  opacity: 0.045 },
      { pos: [-62,  22,  15], color: '#122050', size: 80,  opacity: 0.040 },
      { pos: [  8,  38, -52], color: '#1e0c50', size: 85,  opacity: 0.038 },
    ]

    return defs.map(def => {
      const canvas = document.createElement('canvas')
      canvas.width  = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')!
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0,   def.color + 'ff')
      g.addColorStop(0.4, def.color + '99')
      g.addColorStop(1,   def.color + '00')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 128, 128)

      const tex = new THREE.CanvasTexture(canvas)
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: def.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(def.pos[0], def.pos[1], def.pos[2])
      sprite.scale.setScalar(def.size)
      return sprite
    })
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.0028
      groupRef.current.rotation.x += delta * 0.0009
    }
  })

  return (
    <group ref={groupRef}>
      {sprites.map((s, i) => <primitive key={i} object={s} />)}
    </group>
  )
}
