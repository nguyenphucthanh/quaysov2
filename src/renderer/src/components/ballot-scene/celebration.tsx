import { FC, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSettingStore } from "@store/setting";

const DEFAULT_EMOJIS = ["🎉", "🎊", "✨", "🥳", "🏆", "🎈"];
const COUNT = 28;

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

// Confetti-style emoji burst floating up IN FRONT of the winning ticket (z > ticket)
// distributed on the left and right sides to avoid obscuring the center ticket.
export const Celebration: FC = () => {
  const group = useRef<THREE.Group>(null);
  const settingStore = useSettingStore();

  const bits = useMemo(() => {
    const list = settingStore.congratEmojis?.length
      ? settingStore.congratEmojis
      : DEFAULT_EMOJIS;

    return Array.from({ length: COUNT }, (_, i) => {
      const emojiStr = list[Math.floor(Math.random() * list.length)];
      const isLeft = i % 2 === 0;
      // Position on left (-5.7 to -2.2) or right (2.2 to 5.7) to keep center free
      const x = isLeft
        ? -2.2 - Math.random() * 3.5
        : 2.2 + Math.random() * 3.5;

      return {
        tex: emojiTexture(emojiStr),
        x,
        baseY: (Math.random() - 0.5) * 6,
        z: 6.3 + Math.random() * 1.2, // In front of ticket (ticket is at z=6, camera at z=11)
        speed: 0.4 + Math.random() * 0.6,
        sway: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 0.5,
      };
    });
  }, [settingStore.congratEmojis]);

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
      s.position.set(
        b.x + Math.sin(t * b.sway + b.phase) * 0.3,
        b.baseY + rise,
        b.z
      );
    });
  });

  if (!settingStore.enableCongratEffect) {
    return null;
  }

  return (
    <group ref={group}>
      {bits.map((b, i) => (
        <sprite
          key={i}
          position={[b.x, b.baseY, b.z]}
          scale={[b.scale, b.scale, b.scale]}
        >
          <spriteMaterial map={b.tex} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
};
