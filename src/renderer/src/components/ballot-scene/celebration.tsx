import { FC, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EMOJIS = ["🎉", "🎊", "✨", "🥳", "🏆", "🎈"];
const COUNT = 24;

// Draw an emoji to a canvas → CanvasTexture. 2D fillText renders OS color emoji
// offline, so no font bundling needed (troika Text can't do color emoji).
function emojiTexture(ch: string): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.font = `${size * 0.8}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ch, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Confetti-style emoji burst floating up BEHIND the winning ticket (z < ticket).
export const Celebration: FC = () => {
  const group = useRef<THREE.Group>(null);

  const bits = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        tex: emojiTexture(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]),
        x: (Math.random() - 0.5) * 7,
        baseY: (Math.random() - 0.5) * 6,
        z: 1 + Math.random() * 3, // behind ticket (ticket at z=6)
        speed: 0.4 + Math.random() * 0.6,
        sway: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 0.5,
      })),
    []
  );

  useEffect(() => {
    return () => {
      bits.forEach((b) => b.tex.dispose());
    };
  }, [bits]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((s, i) => {
      const b = bits[i];
      const rise = ((t * b.speed + b.phase) % 8) - 4; // wrap -4..4, loops upward
      s.position.set(b.x + Math.sin(t * b.sway + b.phase) * 0.4, b.baseY + rise, b.z);
    });
  });

  return (
    <group ref={group}>
      {bits.map((b, i) => (
        <sprite key={i} position={[b.x, b.baseY, b.z]} scale={[b.scale, b.scale, b.scale]}>
          <spriteMaterial map={b.tex} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
};
