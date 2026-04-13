import React, { useMemo, useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function PlanetInteractive({
  size,
  color,
  isActive,
  noGlow = false,
  onClick,
  children,
}: {
  size: number
  color: THREE.Color
  isActive: boolean
  noGlow?: boolean
  onClick: () => void
  children: ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-14 * delta)
    if (groupRef.current) {
      const target = isActive ? 1.12 : hovered ? 1.07 : 1
      const curr = groupRef.current.scale.x
      groupRef.current.scale.setScalar(curr + (target - curr) * k)
    }
    if (glowMatRef.current) {
      const targetOpacity = hovered && !isActive ? 0.13 : 0
      glowMatRef.current.opacity += (targetOpacity - glowMatRef.current.opacity) * k
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {children}
      {!noGlow && (
        <mesh scale={1.38}>
          <sphereGeometry args={[size, 24, 24]} />
          <meshBasicMaterial
            ref={glowMatRef}
            color={color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}

type TexturedSphereProps = {
  texturePath: string
  size: number
  isSun: boolean
  planetColor: THREE.Color
  isActive: boolean
  onClick: () => void
}

export function TexturedSphere({
  texturePath,
  size,
  isSun,
  planetColor,
  isActive,
  onClick,
}: TexturedSphereProps) {
  const texture = useTexture(texturePath)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  return (
    <PlanetInteractive size={size} color={planetColor} isActive={isActive} noGlow={isSun} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={isSun ? planetColor : new THREE.Color('#000000')}
          emissiveMap={isSun ? texture : undefined}
          emissiveIntensity={isSun ? 1.5 : 0}
          roughness={isSun ? 0.4 : 0.85}
          metalness={0.02}
        />
      </mesh>
    </PlanetInteractive>
  )
}

export function EarthDayNightSphere({
  size,
  isActive,
  onClick,
}: {
  size: number
  isActive: boolean
  onClick: () => void
}) {
  const dayTex = useTexture('/textures/earth.png')
  const nightTex = useTexture(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/The_earth_at_night.jpg/1280px-The_earth_at_night.jpg',
  )
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  dayTex.colorSpace = THREE.SRGBColorSpace
  nightTex.colorSpace = THREE.SRGBColorSpace
  dayTex.wrapS = dayTex.wrapT = THREE.RepeatWrapping
  nightTex.wrapS = nightTex.wrapT = THREE.RepeatWrapping

  const uniforms = useMemo(
    () => ({
      dayMap: { value: dayTex },
      nightMap: { value: nightTex },
      sunDir: { value: new THREE.Vector3(1, 0, 0) },
    }),
    [dayTex, nightTex],
  )

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return
    const earthPos = new THREE.Vector3()
    meshRef.current.getWorldPosition(earthPos)
    matRef.current.uniforms.sunDir.value
      .copy(earthPos)
      .negate()
      .normalize()
  })

  return (
    <PlanetInteractive size={size} color={new THREE.Color('#3b82f6')} isActive={isActive} onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main() {
            vUv = uv;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D dayMap;
          uniform sampler2D nightMap;
          uniform vec3 sunDir;
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main() {
            float d = dot(vWorldNormal, sunDir);
            float blend = smoothstep(-0.18, 0.28, d);
            vec4 day = texture2D(dayMap, vUv);
            vec4 night = texture2D(nightMap, vUv);
            vec4 nightLit = vec4(night.rgb * 1.3, night.a);
            gl_FragColor = mix(nightLit, day, blend);
          }
        `}
      />
      </mesh>
    </PlanetInteractive>
  )
}

export function GradientSphere({
  size,
  gradientColors,
  color,
  isActive,
  onClick,
}: {
  size: number
  gradientColors: string[]
  color: THREE.Color
  isActive: boolean
  onClick: () => void
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 256)
    gradientColors.forEach((c, i) => {
      grad.addColorStop(i / (gradientColors.length - 1), c)
    })
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradientColors.join(',')])

  return (
    <PlanetInteractive size={size} color={color} isActive={isActive} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.02} />
      </mesh>
    </PlanetInteractive>
  )
}

export function SaturnRing({ planetSize }: { planetSize: number }) {
  const texture = useTexture('/textures/saturn-ring.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping

  const innerR = planetSize * 1.28
  const outerR = planetSize * 2.4

  return (
    <mesh rotation={[-Math.PI / 2 + 0.44, 0, 0.22]}>
      <ringGeometry args={[innerR, outerR, 128, 4]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.92}
        depthWrite={false}
      />
    </mesh>
  )
}

export function ProbeMesh({
  size,
  color,
  isActive,
  onClick,
  isRunningRef,
}: {
  size: number
  color: THREE.Color
  isActive: boolean
  onClick: () => void
  isRunningRef: React.MutableRefObject<boolean>
}) {
  const bodyRef      = useRef<THREE.Group>(null)
  const beaconRef    = useRef<THREE.Mesh>(null)
  const beaconMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const pulseRef     = useRef<THREE.Mesh>(null)
  const pulseMatRef  = useRef<THREE.MeshBasicMaterial>(null)

  const vs = Math.max(size, 0.22)
  const S  = vs

  // ── Parabolic dish via LatheGeometry ─────────────────────────────────
  const dishGeo = useMemo(() => {
    const pts: THREE.Vector2[] = []
    const R = S * 1.72   // outer dish radius
    const D = S * 0.44   // depth at rim  (paraboloid: y = D·(r/R)²)
    for (let i = 0; i <= 26; i++) {
      const t = i / 26
      pts.push(new THREE.Vector2(t * R, t * t * D))
    }
    return new THREE.LatheGeometry(pts, 36)
  }, [S])

  // ── Strut transform data — computed once, not recreated on re-render ────
  const strutData = useMemo(() => (
    [0, (2 / 3) * Math.PI, (4 / 3) * Math.PI].map((a) => {
      const rimX = S * 1.52 * Math.cos(a)
      const rimZ = S * 1.52 * Math.sin(a)
      const len  = Math.sqrt(rimX * rimX + (S * 0.06) * (S * 0.06) + rimZ * rimZ)
      const dir  = new THREE.Vector3(-rimX, S * 0.06, -rimZ).normalize()
      const q    = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      const e    = new THREE.Euler().setFromQuaternion(q)
      return {
        pos: [rimX * 0.5, S * 0.47, rimZ * 0.5] as [number, number, number],
        rot: [e.x, e.y, e.z] as [number, number, number],
        len,
      }
    })
  ), [S])

  // ── Procedural canvas textures ────────────────────────────────────────
  const { bodyTex, dishTex } = useMemo(() => {
    // Gold Kapton foil — bus body
    const bc = document.createElement('canvas')
    bc.width = 256; bc.height = 128
    const bx = bc.getContext('2d')!
    const bg = bx.createLinearGradient(0, 0, 256, 128)
    bg.addColorStop(0.00, '#c09818')
    bg.addColorStop(0.25, '#eac532')
    bg.addColorStop(0.55, '#ae7212')
    bg.addColorStop(0.80, '#d4a41a')
    bg.addColorStop(1.00, '#b89218')
    bx.fillStyle = bg
    bx.fillRect(0, 0, 256, 128)
    // Panel seam lines
    bx.strokeStyle = 'rgba(50,32,0,0.50)'; bx.lineWidth = 2
    for (let i = 1; i < 4; i++) {
      bx.beginPath(); bx.moveTo(i * 64, 0); bx.lineTo(i * 64, 128); bx.stroke()
    }
    bx.beginPath(); bx.moveTo(0, 64); bx.lineTo(256, 64); bx.stroke()
    // Foil reflection patches
    bx.fillStyle = 'rgba(255,228,80,0.15)'; bx.fillRect(0, 0, 68, 64)
    bx.fillStyle = 'rgba(255,240,110,0.10)'; bx.fillRect(130, 0, 75, 128)
    bx.fillStyle = 'rgba(90,58,0,0.13)';     bx.fillRect(66, 66, 62, 62)
    const bodyTex = new THREE.CanvasTexture(bc)
    bodyTex.colorSpace = THREE.SRGBColorSpace

    // Dish — white metallic with radial mesh grid
    const dc = document.createElement('canvas')
    dc.width = 256; dc.height = 256
    const dx = dc.getContext('2d')!
    const dg = dx.createRadialGradient(128, 128, 0, 128, 128, 128)
    dg.addColorStop(0.0, '#f6f6f4')
    dg.addColorStop(0.5, '#e4e4e0')
    dg.addColorStop(0.9, '#ccccca')
    dg.addColorStop(1.0, '#b8b8b6')
    dx.fillStyle = dg
    dx.fillRect(0, 0, 256, 256)
    // Concentric rings
    dx.strokeStyle = 'rgba(145,145,142,0.55)'; dx.lineWidth = 0.9
    for (let r = 1; r <= 6; r++) {
      dx.beginPath(); dx.arc(128, 128, r * 19, 0, Math.PI * 2); dx.stroke()
    }
    // Radial spokes
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2
      dx.beginPath(); dx.moveTo(128, 128)
      dx.lineTo(128 + Math.cos(a) * 127, 128 + Math.sin(a) * 127); dx.stroke()
    }
    const dishTex = new THREE.CanvasTexture(dc)
    dishTex.colorSpace = THREE.SRGBColorSpace

    return { bodyTex, dishTex }
  }, [])

  useFrame(({ clock }, delta) => {
    if (bodyRef.current && isRunningRef.current) {
      bodyRef.current.rotation.y += delta * 0.38
      bodyRef.current.rotation.x += delta * 0.07
    }
    const t = clock.getElapsedTime()
    if (beaconMatRef.current) {
      beaconMatRef.current.opacity = 0.30 + Math.sin(t * 2.2) * 0.20
    }
    if (pulseRef.current && pulseMatRef.current) {
      const s = 1 + ((t * 0.85) % 1) * 2.4
      pulseRef.current.scale.setScalar(s)
      pulseMatRef.current.opacity = Math.max(0, 0.50 - ((t * 0.85) % 1) * 0.50)
    }
  })

  return (
    <PlanetInteractive size={vs} color={color} isActive={isActive} onClick={onClick}>
      {/* Expanding ping ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[vs * 1.05, vs * 1.3, 32]} />
        <meshBasicMaterial
          ref={pulseMatRef}
          color={color}
          transparent
          opacity={0.5}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow beacon */}
      <mesh ref={beaconRef}>
        <sphereGeometry args={[vs * 1.55, 16, 16]} />
        <meshBasicMaterial
          ref={beaconMatRef}
          color={color}
          transparent
          opacity={0.30}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ── Rotating probe assembly ── */}
      <group ref={bodyRef} rotation={[0.28, 0, 0.18]}>

        {/* ── Parabolic dish (Voyager-style HGA) ── */}
        <group position={[0, S * 0.24, 0]}>
          {/* Dish surface */}
          <mesh geometry={dishGeo}>
            <meshStandardMaterial
              map={dishTex}
              roughness={0.18}
              metalness={0.72}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Rim torus */}
          <mesh>
            <torusGeometry args={[S * 1.72, S * 0.022, 8, 40]} />
            <meshStandardMaterial color="#b2b2ae" roughness={0.22} metalness={0.86} />
          </mesh>
          {/* Feed horn (points toward dish center) */}
          <mesh position={[0, S * 0.50, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[S * 0.075, S * 0.18, 8]} />
            <meshStandardMaterial color="#d2d2ce" roughness={0.28} metalness={0.80} />
          </mesh>
          {/* 3 support struts from rim to feed horn */}
          {strutData.map(({ pos, rot, len }, i) => (
            <mesh key={i} position={pos} rotation={rot}>
              <cylinderGeometry args={[S * 0.011, S * 0.011, len, 4]} />
              <meshStandardMaterial color="#aaaaaa" roughness={0.22} metalness={0.88} />
            </mesh>
          ))}
          {/* Mast connecting dish to bus */}
          <mesh position={[0, -S * 0.13, 0]}>
            <cylinderGeometry args={[S * 0.023, S * 0.023, S * 0.26, 6]} />
            <meshStandardMaterial color="#b0b0ac" roughness={0.30} metalness={0.80} />
          </mesh>
        </group>

        {/* ── Central bus — 10-sided cylinder (Voyager-style) ── */}
        <mesh position={[0, -S * 0.13, 0]}>
          <cylinderGeometry args={[S * 0.37, S * 0.37, S * 0.24, 10]} />
          <meshStandardMaterial map={bodyTex} roughness={0.42} metalness={0.62} />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, -S * 0.007, 0]}>
          <cylinderGeometry args={[S * 0.355, S * 0.355, S * 0.024, 10]} />
          <meshStandardMaterial color="#c8a428" roughness={0.28} metalness={0.72} />
        </mesh>
        {/* Bottom cap */}
        <mesh position={[0, -S * 0.253, 0]}>
          <cylinderGeometry args={[S * 0.355, S * 0.355, S * 0.024, 10]} />
          <meshStandardMaterial color="#c8a428" roughness={0.28} metalness={0.72} />
        </mesh>

        {/* ── Magnetometer boom — two-segment articulated arm ── */}
        <mesh position={[0, -S * 0.13, -S * 1.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[S * 0.011, S * 0.011, S * 2.5, 4]} />
          <meshStandardMaterial color="#909090" roughness={0.22} metalness={0.88} />
        </mesh>
        <mesh position={[S * 0.05, -S * 0.13, -S * 2.55]}>
          <sphereGeometry args={[S * 0.028, 6, 6]} />
          <meshStandardMaterial color="#888888" roughness={0.30} metalness={0.85} />
        </mesh>
        <mesh position={[S * 0.12, -S * 0.13, -S * 3.08]} rotation={[Math.PI / 2 + 0.05, 0, -0.06]}>
          <cylinderGeometry args={[S * 0.009, S * 0.009, S * 1.0, 4]} />
          <meshStandardMaterial color="#888888" roughness={0.22} metalness={0.88} />
        </mesh>
        {/* MAG sensor at tip */}
        <mesh position={[S * 0.17, -S * 0.13, -S * 3.60]}>
          <boxGeometry args={[S * 0.068, S * 0.052, S * 0.11]} />
          <meshStandardMaterial color="#6a6a7a" roughness={0.40} metalness={0.72} />
        </mesh>

        {/* ── RTG boom ── */}
        <mesh position={[-S * 0.47, -S * 0.37, -S * 0.92]} rotation={[0.24, -0.17, 0.11]}>
          <cylinderGeometry args={[S * 0.011, S * 0.013, S * 2.5, 4]} />
          <meshStandardMaterial color="#909090" roughness={0.22} metalness={0.88} />
        </mesh>
        {/* RTG unit — cylinder with 4 radiating cooling fins */}
        <group position={[-S * 0.98, -S * 0.62, -S * 2.05]} rotation={[0.24, -0.17, 0]}>
          <mesh>
            <cylinderGeometry args={[S * 0.054, S * 0.054, S * 0.30, 10]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.62} metalness={0.48} />
          </mesh>
          <mesh position={[S * 0.09, 0, 0]}>
            <boxGeometry args={[S * 0.014, S * 0.24, S * 0.12]} />
            <meshStandardMaterial color="#181818" roughness={0.68} metalness={0.42} />
          </mesh>
          <mesh position={[-S * 0.09, 0, 0]}>
            <boxGeometry args={[S * 0.014, S * 0.24, S * 0.12]} />
            <meshStandardMaterial color="#181818" roughness={0.68} metalness={0.42} />
          </mesh>
          <mesh position={[0, 0, S * 0.09]}>
            <boxGeometry args={[S * 0.12, S * 0.24, S * 0.014]} />
            <meshStandardMaterial color="#181818" roughness={0.68} metalness={0.42} />
          </mesh>
          <mesh position={[0, 0, -S * 0.09]}>
            <boxGeometry args={[S * 0.12, S * 0.24, S * 0.014]} />
            <meshStandardMaterial color="#181818" roughness={0.68} metalness={0.42} />
          </mesh>
        </group>

        {/* ── Science platform ── */}
        <group position={[S * 0.77, -S * 0.32, -S * 0.78]}>
          {/* Connecting boom */}
          <mesh position={[-S * 0.29, S * 0.07, S * 0.28]} rotation={[0.14, 0.33, 0.1]}>
            <cylinderGeometry args={[S * 0.012, S * 0.012, S * 0.86, 4]} />
            <meshStandardMaterial color="#888888" roughness={0.28} metalness={0.82} />
          </mesh>
          {/* Platform body */}
          <mesh>
            <boxGeometry args={[S * 0.16, S * 0.095, S * 0.17]} />
            <meshStandardMaterial color="#c0a020" roughness={0.42} metalness={0.58} />
          </mesh>
          {/* Instrument telescope */}
          <mesh position={[S * 0.14, 0, S * 0.02]} rotation={[Math.PI / 6, Math.PI * 0.3, 0]}>
            <cylinderGeometry args={[S * 0.036, S * 0.036, S * 0.11, 8]} />
            <meshStandardMaterial color="#78788a" roughness={0.30} metalness={0.75} />
          </mesh>
        </group>

      </group>
    </PlanetInteractive>
  )
}
