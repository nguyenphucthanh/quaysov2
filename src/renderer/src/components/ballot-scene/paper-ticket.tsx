import { FC, useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
// Local font so drawn numbers render offline (packaged app has no CDN). Digits
// live in the latin subset — enough for the ticket numbers.
import numberFont from "@fontsource/roboto/files/roboto-latin-700-normal.woff?url";

const RED_BG = "#c1121f";
const GOLD = "#f4c430";

type PaperTicketProps = {
  number: string;
  target: [number, number, number];
  from: [number, number, number];
  scale?: number;
  float?: boolean;
  opacity?: number;
};

// A real (non-instanced) paper ticket carrying a drawn number. Lerps from `from`
// to `target` on mount — used for the reveal drop (top→center) and the fly-to-wall.
export const PaperTicket: FC<PaperTicketProps> = ({
  number,
  target,
  from,
  scale = 1,
  float = false,
  opacity = 1,
}) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const settled = useRef(false);
  const startDist = useRef(1); // travel distance at mount, for spin progress

  // Set start pose once on mount. Not via JSX props — those get re-applied on
  // every parent re-render, which would snap settled tickets back and re-fly.
  const setRef = useCallback(
    (g: THREE.Group | null) => {
      groupRef.current = g;
      if (!g) return;
      g.position.set(from[0], from[1], from[2]);
      g.scale.setScalar(0.12); // start tiny → zooms up as it flies
      startDist.current = Math.max(
        g.position.distanceTo(new THREE.Vector3(target[0], target[1], target[2])),
        0.001
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, rawDelta) => {
    const g = groupRef.current;
    if (!g) return;
    const dt = Math.min(rawDelta, 0.05);
    const [tx, ty, tz] = target;
    const ease = 1 - Math.pow(0.14, dt); // slower flight → zoom reads clearly
    g.position.x += (tx - g.position.x) * ease;
    g.position.y += (ty - g.position.y) * ease;
    g.position.z += (tz - g.position.z) * ease;
    // Zoom in: scale grows toward the target size as it flies down.
    g.scale.addScalar((scale - g.scale.x) * ease);

    const remaining = g.position.distanceTo(new THREE.Vector3(tx, ty, tz));
    if (!settled.current) {
      // Cinematic spin + flip while flying — decays to 0 as it lands.
      const p = Math.min(remaining / startDist.current, 1); // 1 far → 0 landed
      g.rotation.z = p * Math.PI * 2.5; // spin around face
      g.rotation.x = p * Math.PI * 2; // flip forward
    }
    if (!settled.current && remaining < 0.05) {
      settled.current = true;
      g.rotation.set(0, 0, 0);
    }
    // Gentle idle bob once settled (only the held center pick floats).
    if (float && settled.current) {
      const t = state.clock.elapsedTime;
      g.rotation.z = Math.sin(t * 0.8) * 0.05;
      g.rotation.y = Math.sin(t * 0.6) * 0.08;
      g.position.y = ty + Math.sin(t * 1.2) * 0.08;
    }
  });

  return (
    <group ref={setRef} visible={opacity > 0}>
      {/* Gold rim: slightly larger plate behind the red card. */}
      <RoundedBox args={[2.12, 1.62, 0.03]} radius={0.09} smoothness={4} position={[0, 0, -0.01]}>
        <meshStandardMaterial
          color={GOLD}
          roughness={0.18}
          metalness={0.95}
          envMapIntensity={1.4}
          emissive={GOLD}
          emissiveIntensity={0.15 * opacity}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </RoundedBox>
      <RoundedBox args={[2, 1.5, 0.04]} radius={0.08} smoothness={4} castShadow={opacity > 0.5}>
        <meshStandardMaterial
          color={RED_BG}
          roughness={0.28}
          metalness={0.85}
          envMapIntensity={1.2}
          emissive={RED_BG}
          emissiveIntensity={0.08 * opacity}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.875}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
        font={numberFont}
        fillOpacity={opacity}
      >
        {number}
      </Text>
    </group>
  );
};
