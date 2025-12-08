/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

// Assets from public folder
import cardGLB from '/lanyard/card.glb?url';
import lanyardTexture from '/lanyard/lanyard.png';
// YOUR CUSTOM VIP STAGE PASS TEXTURE
import cardLogo from '/lanyard/card-logo.png';

import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          // Prevent default touch behavior on canvas
          gl.domElement.style.touchAction = 'none';
        }}
        style={{ touchAction: 'none' }}
      >
        {/* Reduced ambient light for less brightness */}
        <ambientLight intensity={Math.PI * 0.5} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={1.5}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={2}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={2}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={6}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardTexture);
  
  // Load your custom VIP Stage Pass texture
  const logoTexture = useTexture(cardLogo);
  
  // Configure the texture properly
  useMemo(() => {
    if (logoTexture) {
      logoTexture.flipY = false;
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);
  
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  
  // Store current pointer position for continuous tracking
  const pointerPos = useRef({ x: 0, y: 0 });

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  // Get access to Three.js state
  const { gl } = useThree();

  useFrame((state, delta) => {
    if (dragged) {
      // Use our tracked pointer position instead of state.pointer
      vec.set(pointerPos.current.x, pointerPos.current.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  // Convert screen coordinates to normalized device coordinates
  const updatePointerPos = useCallback((clientX, clientY) => {
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    pointerPos.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerPos.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }, [gl]);

  // Handle pointer down - start dragging
  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    
    // Prevent default to stop scrolling on touch
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault?.();
    }
    
    // Set pointer capture for continuous tracking
    if (e.target && e.target.setPointerCapture) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {
        // Ignore errors
      }
    }
    
    // Update initial pointer position
    updatePointerPos(e.clientX, e.clientY);
    
    // Calculate drag offset
    const dragOffset = new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()));
    drag(dragOffset);
  }, [updatePointerPos]);

  // Handle pointer move - update position while dragging
  const handlePointerMove = useCallback((e) => {
    if (!dragged) return;
    
    e.stopPropagation();
    
    // Prevent default to stop scrolling on touch
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault?.();
    }
    
    updatePointerPos(e.clientX, e.clientY);
  }, [dragged, updatePointerPos]);

  // Handle pointer up - stop dragging
  const handlePointerUp = useCallback((e) => {
    e.stopPropagation();
    
    // Release pointer capture
    if (e.target && e.target.releasePointerCapture) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore if pointer capture wasn't set
      }
    }
    
    drag(false);
  }, []);

  // Handle pointer cancel (touch interrupted)
  const handlePointerCancel = useCallback(() => {
    drag(false);
  }, []);

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerUp}
          >
            {/* VIP Stage Pass Card - matte plastic look */}
            <mesh geometry={nodes.card.geometry}>
              <meshStandardMaterial
                map={logoTexture}
                roughness={0.6}
                metalness={0.0}
                envMapIntensity={0.3}
              />
            </mesh>
            {/* Clip and clamp - metallic silver */}
            <mesh geometry={nodes.clip.geometry}>
              <meshStandardMaterial
                color="#888888"
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clamp.geometry}>
              <meshStandardMaterial
                color="#888888"
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}