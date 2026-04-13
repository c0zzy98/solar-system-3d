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
  const bodyRef    = useRef<THREE.Group>(null)
  const beaconRef  = useRef<THREE.Mesh>(null)
  const beaconMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const pulseRef   = useRef<THREE.Mesh>(null)
  const pulseMatRef = useRef<THREE.MeshBasicMaterial>(null)

  // Probes render at a fixed larger visual size so they're clearly visible
  const vs = Math.max(size, 0.22)

  useFrame(({ clock }, delta) => {
    // Slow rotation of the body
    if (bodyRef.current && isRunningRef.current) {
      bodyRef.current.rotation.y += delta * 0.6
      bodyRef.current.rotation.x += delta * 0.25
    }
    const t = clock.getElapsedTime()
    // Beacon pulse: opacity oscillates
    if (beaconMatRef.current) {
      beaconMatRef.current.opacity = 0.35 + Math.sin(t * 2.2) * 0.25
    }
    // Expanding ping ring
    if (pulseRef.current && pulseMatRef.current) {
      const s = 1 + ((t * 0.9) % 1) * 2.2
      pulseRef.current.scale.setScalar(s)
      pulseMatRef.current.opacity = Math.max(0, 0.55 - ((t * 0.9) % 1) * 0.55)
    }
  })

  return (
    <PlanetInteractive size={vs} color={color} isActive={isActive} onClick={onClick}>
      {/* Expanding ping ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[vs * 1.05, vs * 1.35, 32]} />
        <meshBasicMaterial
          ref={pulseMatRef}
          color={color}
          transparent
          opacity={0.5}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow beacon sphere */}
      <mesh ref={beaconRef}>
        <sphereGeometry args={[vs * 1.6, 16, 16]} />
        <meshBasicMaterial
          ref={beaconMatRef}
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rotating body group */}
      <group ref={bodyRef}>
        {/* Main octahedron body */}
        <mesh>
          <octahedronGeometry args={[vs, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
        {/* Dish antenna */}
        <mesh position={[0, vs * 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[vs * 0.9, vs * 0.9, vs * 0.06, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* Antenna mast */}
        <mesh position={[0, vs * 0.85, 0]}>
          <cylinderGeometry args={[vs * 0.04, vs * 0.04, vs * 1.4, 4]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </PlanetInteractive>
  )
}
