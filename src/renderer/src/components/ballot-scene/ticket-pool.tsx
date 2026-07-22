import { FC, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ponytail: fixed decorative pool, independent of numberRange (see Q2). Blank
// paper only — the drawn number lives on the reveal/wall tickets, not here.
const COUNT = 100;

// Idle: tickets cluster inside an invisible sphere near the center.
const SPHERE_R = 2.6;
const SPREAD = { x: 8, y: 6, z: 5 };
// Wind carries tickets up and out; wrap them back once past these bounds.
const BOUND = { x: 8, y: 7, z: 4 };

// Random point inside a sphere of radius r.
const inSphere = (r: number): THREE.Vector3 => {
  const v = new THREE.Vector3(rand(1), rand(1), rand(1));
  while (v.lengthSq() > 1) v.set(rand(1), rand(1), rand(1));
  return v.multiplyScalar(r);
};

type Grain = {
  home: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: THREE.Vector3;
  seed: number;
};

const rand = (n: number) => (Math.random() - 0.5) * 2 * n;

// White paper, warm-lit — not tied to theme (themes made it grey).
const PAPER = "#fdfcf8";

export const TicketPool: FC<{ running: boolean }> = ({ running }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const wasRunning = useRef(false);

  const grains = useMemo<Grain[]>(
    () =>
      Array.from({ length: COUNT }, () => {
        const home = inSphere(SPHERE_R);
        return {
          home,
          pos: home.clone(),
          vel: new THREE.Vector3(),
          rot: new THREE.Euler(rand(Math.PI), rand(Math.PI), rand(Math.PI)),
          rotVel: new THREE.Vector3(),
          seed: Math.random() * 100,
        };
      }),
    []
  );

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const justStarted = running && !wasRunning.current;
    wasRunning.current = running;

    grains.forEach((g, i) => {
      if (running) {
        // On the first frame of a run, kick every ticket with a violent impulse.
        if (justStarted) {
          g.vel.set(rand(14), Math.random() * 16 + 6, rand(10));
          g.rotVel.set(rand(14), rand(14), rand(14));
        }
        // Violent gusting wind: strong lift + swirling turbulence, fast tumble.
        g.vel.x += (Math.sin(t * 4 + g.seed) * 7 + rand(3)) * dt;
        g.vel.y += (Math.cos(t * 5 + g.seed) * 4 + 9) * dt;
        g.vel.z += (Math.sin(t * 3.5 + g.seed * 1.7) * 5) * dt;
        g.vel.multiplyScalar(0.99);
        // Clamp so it stays wild but not unbounded.
        g.vel.clampLength(0, 22);
        g.pos.addScaledVector(g.vel, dt);
        g.rot.x += g.rotVel.x * dt;
        g.rot.y += g.rotVel.y * dt;
        g.rot.z += g.rotVel.z * dt;
        // Wrap: once blown out of bounds, re-enter from the bottom.
        if (g.pos.y > BOUND.y || Math.abs(g.pos.x) > BOUND.x) {
          g.pos.set(rand(SPREAD.x), -BOUND.y, rand(SPREAD.z));
          g.vel.y = Math.random() * 16 + 6;
        }
      } else {
        // Idle: ease back home with a gentle sinusoidal float.
        const driftX = Math.sin(t * 0.5 + g.seed) * 0.4;
        const driftY = Math.cos(t * 0.4 + g.seed) * 0.4;
        const target = new THREE.Vector3(
          g.home.x + driftX,
          g.home.y + driftY,
          g.home.z
        );
        g.pos.lerp(target, 1 - Math.pow(0.001, dt));
        g.vel.multiplyScalar(0.9);
        g.rot.x += Math.sin(t * 0.3 + g.seed) * 0.15 * dt;
        g.rot.y += Math.cos(t * 0.25 + g.seed) * 0.15 * dt;
      }

      dummy.position.copy(g.pos);
      dummy.rotation.copy(g.rot);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, COUNT]}
      castShadow
    >
      <planeGeometry args={[1, 0.7]} />
      <meshStandardMaterial
        color={PAPER}
        side={THREE.DoubleSide}
        roughness={0.9}
        metalness={0}
        emissive={PAPER}
        emissiveIntensity={0.15}
      />
    </instancedMesh>
  );
};
