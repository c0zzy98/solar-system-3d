import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ORBIT_VERT, ORBIT_FRAG } from '../shaders'
import {
  PLANETS, MOON_ORBIT_RADIUS,
  PLANET_DISTANCE_KM, formatKm,
  type PlanetData, type PlanetId,
} from '../data/planets'
import {
  ProbeMesh, TexturedSphere, EarthDayNightSphere,
  GradientSphere, SaturnRing, PlanetInteractive,
} from './Planets3D'
import { MilkyWayBackground, NebulaLayer, ParallaxStars, ShootingComets, SunGlow } from './Effects3D'

export function Scene({
  activePlanetId,
  onPlanetClick,
  hideLabels,
  isRunningRef,
}: {
  activePlanetId: PlanetId | null
  onPlanetClick: (id: PlanetId) => void
  hideLabels: boolean
  isRunningRef: React.MutableRefObject<boolean>
}) {
  const orbitControlsRef = useRef<any>(null)
  const planetPositionsRef = useRef<Record<string, THREE.Vector3>>({})

  return (
    <>
      <color attach="background" args={['#02050b']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={35} color="#f59e0b" />
      <directionalLight position={[8, 6, 8]} intensity={1.3} />
      <MilkyWayBackground />
      <NebulaLayer />
      <ParallaxStars />
      <ShootingComets />
      <SunGlow />
      <SolarSystemScene
        activePlanetId={activePlanetId}
        onPlanetClick={onPlanetClick}
        planetPositionsRef={planetPositionsRef}
        hideLabels={hideLabels}
        isRunningRef={isRunningRef}
      />
      <PlanetDistanceLine
        activePlanetId={activePlanetId}
        planetPositionsRef={planetPositionsRef}
      />
      <CameraController
        activePlanetId={activePlanetId}
        orbitControlsRef={orbitControlsRef}
        planetPositionsRef={planetPositionsRef}
      />
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={0.3}
        maxDistance={70}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        rotateSpeed={0.45}
      />
    </>
  )
}

function CameraController({
  activePlanetId,
  orbitControlsRef,
  planetPositionsRef,
}: {
  activePlanetId: PlanetId | null
  orbitControlsRef: { current: any }
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
}) {
  const { camera } = useThree()
  const lerpedTarget  = useRef(new THREE.Vector3())
  const prevPlanetId  = useRef<PlanetId | null>(null)
  const zeroVec       = useRef(new THREE.Vector3(0, 0, 0))

  const camZooming   = useRef(false)
  const camZoomProg  = useRef(0)
  const camZoomFrom  = useRef(new THREE.Vector3())
  const camZoomDir   = useRef(new THREE.Vector3(0.3, 0.5, 1))
  const camZoomDist  = useRef(0)
  const HOME_POS     = useRef(new THREE.Vector3(0, 10, 16))

  useFrame((_, delta) => {
    const controls = orbitControlsRef.current
    if (!controls) return

    const activePlanetPos = activePlanetId
      ? planetPositionsRef.current[activePlanetId]
      : undefined
    const desiredTarget = activePlanetPos ?? zeroVec.current

    // Detect selection change → kick off zoom
    if (activePlanetId !== prevPlanetId.current) {
      prevPlanetId.current = activePlanetId
      lerpedTarget.current.copy(controls.target)
      camZoomFrom.current.copy(camera.position)
      camZoomProg.current = 0
      camZooming.current  = true

      if (activePlanetId && activePlanetPos) {
        const planet = PLANETS.find(p => p.id === activePlanetId)!
        camZoomDist.current = Math.max(planet.size * 7.2, 3.6)
        // Fixed canonical approach angle — consistent cinematic look
        camZoomDir.current.set(0.3, 0.6, 1.0).normalize()
      }
    }

    // Always lerp the orbit target
    lerpedTarget.current.lerp(desiredTarget, 0.07)
    controls.target.copy(lerpedTarget.current)

    if (camZooming.current) {
      // Disable OrbitControls so it doesn't override camera position
      controls.enabled = false

      camZoomProg.current = Math.min(camZoomProg.current + delta * 1.8, 1)
      const t = 1 - Math.pow(1 - camZoomProg.current, 3)

      // Destination: planet pos + stored direction * distance
      const dest = activePlanetId && activePlanetPos
        ? activePlanetPos.clone().addScaledVector(camZoomDir.current, camZoomDist.current)
        : HOME_POS.current.clone()

      camera.position.lerpVectors(camZoomFrom.current, dest, t)
      camera.lookAt(lerpedTarget.current)

      if (camZoomProg.current >= 1) {
        camZooming.current  = false
        controls.enabled    = true
      }
    } else {
      controls.update()
    }
  })

  return null
}

function PlanetDistanceLine({
  activePlanetId,
  planetPositionsRef,
}: {
  activePlanetId: PlanetId | null
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
}) {
  const midGroupRef = useRef<THREE.Group>(null)
  const posBuffer   = useMemo(() => new Float32Array(6), [])
  const prevPos     = useRef(new THREE.Vector3())
  const MOVE_THRESHOLD_SQ = 0.0004

  // ── One-time lazy init ────────────────────────────────────────────────
  // Geometry, material and Line are created ONCE for the lifetime of this
  // component. Subsequent planet changes only update the material color
  // imperatively — no new Three.js objects, no shader recompilation spike.
  const lineRef = useRef<THREE.Line | null>(null)
  const matRef  = useRef<THREE.LineDashedMaterial | null>(null)
  if (!lineRef.current) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posBuffer, 3))
    const mat = new THREE.LineDashedMaterial({
      color: '#c0c0c0',
      dashSize: 0.22,
      gapSize: 0.1,
      opacity: 0.65,
      transparent: true,
    })
    lineRef.current = new THREE.Line(geo, mat)
    matRef.current  = mat
  }

  const planetForLine =
    activePlanetId && activePlanetId !== 'sun'
      ? PLANETS.find((p) => p.id === activePlanetId) ?? null
      : null

  // Imperatively update color — O(1), no allocation, no GPU reupload
  const prevColorId = useRef<string | null>(null)
  if (planetForLine?.id !== prevColorId.current) {
    prevColorId.current = planetForLine?.id ?? null
    matRef.current!.color.set(planetForLine?.color ?? '#c0c0c0')
  }

  useFrame(() => {
    if (!activePlanetId || activePlanetId === 'sun') return
    const pos = planetPositionsRef.current[activePlanetId]
    if (!pos || !midGroupRef.current) return

    if (prevPos.current.distanceToSquared(pos) < MOVE_THRESHOLD_SQ) return
    prevPos.current.copy(pos)

    posBuffer[3] = pos.x
    posBuffer[4] = pos.y
    posBuffer[5] = pos.z
    ;(lineRef.current!.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    lineRef.current!.computeLineDistances()
    midGroupRef.current.position.set(pos.x * 0.5, pos.y * 0.5 + 0.18, pos.z * 0.5)
  })

  const km = activePlanetId && activePlanetId !== 'sun'
    ? PLANET_DISTANCE_KM[activePlanetId]
    : null

  // Always render the same <primitive> — stable object ref means R3F never
  // removes/re-adds it to the scene graph. Hide via `visible` prop instead.
  return (
    <group>
      <primitive object={lineRef.current} visible={planetForLine !== null} />
      {planetForLine && km && (
        <group ref={midGroupRef}>
          <Html center distanceFactor={10} zIndexRange={[0, 10]}>
            <div
              style={{
                background: 'rgba(2,5,11,0.90)',
                border: `1px solid ${planetForLine.color}55`,
                borderRadius: 8,
                padding: '4px 10px',
                color: '#fff',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                fontSize: 12,
                lineHeight: 1.5,
                boxShadow: `0 0 10px ${planetForLine.color}33`,
              }}
            >
              <span style={{ color: planetForLine.color, fontWeight: 700 }}>{formatKm(km)}</span>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>od Słońca</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  )
}

function SciFiOrbitRing({
  radius,
  color,
  pulseSpeed = 0.07,
}: {
  radius: number
  color: string
  pulseSpeed?: number
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const N = 512

  const { positions, angles } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const ang = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      pos[i * 3] = Math.cos(a) * radius
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = Math.sin(a) * radius
      ang[i] = a
    }
    return { positions: pos, angles: ang }
  }, [radius])

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      orbitColor: { value: new THREE.Color(color) },
      pulseSpeed: { value: pulseSpeed },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.time.value = clock.getElapsedTime()
  })

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={ORBIT_VERT}
        fragmentShader={ORBIT_FRAG}
        transparent
        depthWrite={false}
      />
    </lineLoop>
  )
}

type SolarSystemSceneProps = {
  activePlanetId: PlanetId | null
  onPlanetClick: (id: PlanetId) => void
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
  hideLabels: boolean
  isRunningRef: React.MutableRefObject<boolean>
}

const SolarSystemScene = memo(function SolarSystemScene({
  activePlanetId,
  onPlanetClick,
  planetPositionsRef,
  hideLabels,
  isRunningRef,
}: SolarSystemSceneProps) {
  return (
    <group rotation={[0, 0, 0]}>
      {PLANETS.filter((p) => p.orbitRadius && p.id !== 'moon' && !p.isProbe).map((planet) => (
        <SciFiOrbitRing
          key={planet.id}
          radius={planet.orbitRadius!}
          color={planet.color}
          pulseSpeed={(planet.orbitSpeed ?? 0.05) * 0.48}
        />
      ))}

      {PLANETS.filter((p) => p.id !== 'moon').map((planet) => (
        <AnimatedPlanet
          key={planet.id}
          planet={planet}
          isActive={activePlanetId === planet.id}
          onPlanetClick={onPlanetClick}
          moonIsActive={planet.id === 'earth' ? activePlanetId === 'moon' : false}
          planetPositionsRef={planetPositionsRef}
          hideLabel={hideLabels}
          isRunningRef={isRunningRef}
        />
      ))}
    </group>
  )
})

type AnimatedPlanetProps = {
  planet: PlanetData
  isActive: boolean
  onPlanetClick: (id: PlanetId) => void
  moonIsActive: boolean
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
  hideLabel: boolean
  isRunningRef: React.MutableRefObject<boolean>
}

const AnimatedPlanet = memo(function AnimatedPlanet({ planet, isActive, onPlanetClick, moonIsActive, planetPositionsRef, hideLabel, isRunningRef }: AnimatedPlanetProps) {
  const color = useMemo(() => new THREE.Color(planet.color), [planet.color])
  const handleClick = useCallback(() => onPlanetClick(planet.id as PlanetId), [onPlanetClick, planet.id])
  const moonData = useMemo(() => PLANETS.find(p => p.id === 'moon')!, [])
  const orbitRef = useRef<THREE.Group>(null)
  const selfRef = useRef<THREE.Group>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (!isRunningRef.current) return
    if (planet.orbitRadius && planet.orbitSpeed && orbitRef.current) {
      angleRef.current += delta * planet.orbitSpeed
      orbitRef.current.position.x = Math.cos(angleRef.current) * planet.orbitRadius
      orbitRef.current.position.z = Math.sin(angleRef.current) * planet.orbitRadius
    }
    if (selfRef.current && planet.rotationSpeed) {
      selfRef.current.rotation.y += delta * planet.rotationSpeed
    }
    if (orbitRef.current) {
      if (!planetPositionsRef.current[planet.id]) {
        planetPositionsRef.current[planet.id] = new THREE.Vector3()
      }
      orbitRef.current.getWorldPosition(planetPositionsRef.current[planet.id])
    }
  })

  const initPos: [number, number, number] = planet.orbitRadius
    ? [planet.orbitRadius, 0, 0]
    : planet.position

  return (
    <group ref={orbitRef} position={initPos}>
      <group ref={selfRef}>
        {planet.isProbe ? (
          <ProbeMesh
            size={planet.size}
            color={color}
            isActive={isActive}
            onClick={handleClick}
            isRunningRef={isRunningRef}
          />
        ) : planet.texturePath ? (
          planet.id === 'earth' ? (
            <EarthDayNightSphere
              size={planet.size}
              isActive={isActive}
              onClick={handleClick}
            />
          ) : (
            <TexturedSphere
              texturePath={planet.texturePath}
              size={planet.size}
              isSun={planet.id === 'sun'}
              planetColor={color}
              isActive={isActive}
              onClick={handleClick}
            />
          )
        ) : planet.gradientColors ? (
          <GradientSphere
            size={planet.size}
            gradientColors={planet.gradientColors}
            color={color}
            isActive={isActive}
            onClick={handleClick}
          />
        ) : (
          <PlanetInteractive size={planet.size} color={color} isActive={isActive} onClick={handleClick}>
            <mesh>
              <sphereGeometry args={[planet.size, 64, 64]} />
              <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
            </mesh>
          </PlanetInteractive>
        )}
      </group>
      <Html position={planet.labelOffset} center distanceFactor={10}>
        {!hideLabel && (
          <div className={`font-orbitron select-none whitespace-nowrap text-[10px] uppercase tracking-[0.15em] md:text-xs ${planet.isProbe ? 'text-sky-400/80' : 'text-white/75'}`}>
            {planet.name}
          </div>
        )}
      </Html>
      {planet.id === 'saturn' && <SaturnRing planetSize={planet.size} />}
      {planet.id === 'earth' && (
        <>
          <SciFiOrbitRing radius={MOON_ORBIT_RADIUS} color="#c8c8d8" pulseSpeed={0.14} />
          <AnimatedMoon
            moon={moonData}
            isActive={moonIsActive}
            onPlanetClick={onPlanetClick}
            planetPositionsRef={planetPositionsRef}
            hideLabel={hideLabel}
            isRunningRef={isRunningRef}
          />
        </>
      )}
    </group>
  )
})

type AnimatedMoonProps = {
  moon: PlanetData
  isActive: boolean
  onPlanetClick: (id: PlanetId) => void
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
  hideLabel: boolean
  isRunningRef: React.MutableRefObject<boolean>
}

function AnimatedMoon({ moon, isActive, onPlanetClick, planetPositionsRef, hideLabel, isRunningRef }: AnimatedMoonProps) {
  const color = useMemo(() => new THREE.Color(moon.color), [moon.color])
  const handleClick = useCallback(() => onPlanetClick('moon'), [onPlanetClick])
  const groupRef = useRef<THREE.Group>(null)
  const selfRef = useRef<THREE.Group>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (!isRunningRef.current) return
    if (groupRef.current) {
      angleRef.current += delta * 0.42
      groupRef.current.position.x = Math.cos(angleRef.current) * MOON_ORBIT_RADIUS
      groupRef.current.position.z = Math.sin(angleRef.current) * MOON_ORBIT_RADIUS
    }
    if (selfRef.current) {
      selfRef.current.rotation.y += delta * 0.025
    }
    if (groupRef.current) {
      if (!planetPositionsRef.current['moon']) {
        planetPositionsRef.current['moon'] = new THREE.Vector3()
      }
      groupRef.current.getWorldPosition(planetPositionsRef.current['moon'])
    }
  })

  return (
    <group ref={groupRef} position={[MOON_ORBIT_RADIUS, 0, 0]}>
      <group ref={selfRef}>
        {moon.texturePath ? (
          <TexturedSphere
            texturePath={moon.texturePath}
            size={moon.size}
            isSun={false}
            planetColor={color}
            isActive={isActive}
            onClick={handleClick}
          />
        ) : (
          <PlanetInteractive size={moon.size} color={color} isActive={isActive} onClick={handleClick}>
            <mesh>
              <sphereGeometry args={[moon.size, 32, 32]} />
              <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
            </mesh>
          </PlanetInteractive>
        )}
      </group>
      <Html position={moon.labelOffset} center distanceFactor={10}>
        {!hideLabel && (
          <div className="font-orbitron select-none whitespace-nowrap text-[10px] uppercase tracking-[0.15em] text-white/75 md:text-xs">
            {moon.name}
          </div>
        )}
      </Html>
    </group>
  )
}
