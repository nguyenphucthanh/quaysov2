import { FC, useMemo } from "react";
import * as THREE from "three";
import { HalfFloatType } from "three";
import { useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  Sparkles,
  Text,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { TicketPool } from "./ticket-pool";
import { PaperTicket } from "./paper-ticket";
import { Celebration } from "./celebration";
import { readPalette } from "./theme-colors";
// Thin (100) Roboto, vietnamese subset so diacritics render offline.
import titleFont from "@fontsource/roboto/files/roboto-vietnamese-100-normal.woff?url";

export type SceneProps = {
  running: boolean;
  currentPick: string | null;
  history: string[];
  theme: string;
  title1: string;
  title2: string;
  fogOpacity: number; // 0-100, repurposed ballotBoxOpacity
};

// Pick sits close to the camera, front and center — big and in focus.
const CENTER: [number, number, number] = [0, 0, 6];
const TOP: [number, number, number] = [0, 10, 6];

export const Scene: FC<SceneProps> = ({
  running,
  currentPick,
  history,
  theme,
  title1,
  title2,
  fogOpacity,
}) => {
  // Rebuild palette whenever the theme changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const palette = useMemo(() => readPalette(), [theme]);

  // viewport = world units filling the screen at z=0 (where the wall sits).
  const { width: vw, height: vh } = useThree((s) => s.viewport);

  // Wall pinned to the top-right corner, growing left→down. Responsive: anchors
  // to the live viewport so it hugs the corner at any aspect ratio.
  // When tickets exceed the screen height, oldest tickets fade out / hide at top.
  const wall = useMemo(() => {
    const count = history.length;
    const cols = count > 12 ? 3 : 2;
    const rows = Math.ceil(count / cols) || 1;
    const s = Math.max(0.35, Math.min(0.48, 7 / rows));
    const tw = 2 * s;
    const th = 1.5 * s;
    const cw = tw + 0.15;
    const ch = th + 0.12;
    const margin = 0.4;
    // Center of the top-right-most ticket slot.
    const rightX = vw / 2 - margin - tw / 2;
    const topY = vh / 2 - margin - th / 2;

    // Available screen height from top ticket slot down to bottom margin
    const availableHeight = vh - 2 * margin - th;
    const maxRows = Math.max(1, Math.floor(availableHeight / ch) + 1);
    const maxVisible = maxRows * cols;

    // Number of oldest tickets to hide because list exceeds screen height
    const hiddenCount = Math.max(0, count - maxVisible);
    const fadeRows = 1;
    const fadeCount = fadeRows * cols;

    return history.map((entry, i) => {
      const visIndex = i - hiddenCount;
      if (visIndex < 0) {
        return {
          entry,
          scale: s,
          target: [rightX, topY + ch, 0] as [number, number, number],
          opacity: 0,
          hidden: true,
        };
      }

      const col = visIndex % cols;
      const row = Math.floor(visIndex / cols);

      let opacity = 1;
      if (visIndex < fadeCount && hiddenCount > 0) {
        opacity = Math.max(0.25, (visIndex + 1) / (fadeCount + 1));
      }

      return {
        entry,
        scale: s,
        target: [rightX - col * cw, topY - row * ch, 0] as [
          number,
          number,
          number,
        ],
        opacity,
        hidden: false,
      };
    });
  }, [history, vw, vh]);

  const fogDensity = (fogOpacity / 100) * 0.05;

  return (
    <>
      <fogExp2 attach="fog" args={[palette.fog.getHex(), fogDensity]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 8, 6]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={[-6, -2, 4]}
        intensity={0.6}
        color={palette.accent}
      />

      {/* Local env map (no CDN) so the metallic cards actually reflect something. */}
      <Environment resolution={128}>
        <Lightformer intensity={3} position={[0, 3, 5]} scale={[12, 6, 1]} />
        <Lightformer
          intensity={2}
          color="#fff2cc"
          position={[-5, 1, 3]}
          scale={[5, 8, 1]}
        />
        <Lightformer
          intensity={1.5}
          color="#ffd9a0"
          position={[5, -2, 2]}
          scale={[6, 6, 1]}
        />
        <Lightformer intensity={1} position={[0, -4, -3]} scale={[10, 6, 1]} />
      </Environment>

      <TicketPool running={running} />

      {/* ponytail: titles use troika's default (CDN) Roboto, which covers
          Vietnamese online. Offline events tofu — bundle a full Vietnamese font
          file and pass it as `font=` if that matters. */}
      {(title1 || title2) && (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          {/* Left "wall": pushed left + back and yaw-rotated so the titles recede
              into the room like signage on an angled wall. Neon = bright emissive
              + fat glowing outline; the Bloom pass (threshold 0.85) does the halo. */}
          <group position={[-vw / 2 + 0.6, 0, -1]} rotation={[0, 0.5, 0]}>
            {title1 && (
              <Text
                position={[0, 4.5, 0]}
                font={titleFont}
                fontSize={0.825}
                anchorX="left"
                anchorY="middle"
                outlineWidth={0}
                outlineColor={palette.secondary}
                outlineBlur={0.04}
                outlineOpacity={0.35}
              >
                {title1}
                <meshStandardMaterial
                  color={palette.secondary}
                  emissive={palette.secondary}
                  emissiveIntensity={0.15}
                />
              </Text>
            )}
            {title2 && (
              <Text
                position={[0, 2.7, 0]}
                font={titleFont}
                fontSize={1.425}
                anchorX="left"
                anchorY="middle"
                outlineWidth={0}
                outlineColor={palette.primary}
                outlineBlur={0.05}
                outlineOpacity={0.35}
              >
                {title2}
                <meshStandardMaterial
                  color={palette.primary}
                  emissive={palette.primary}
                  emissiveIntensity={0.2}
                />
              </Text>
            )}
          </group>
        </Float>
      )}

      {/* Congratulation emoji burst floating up BEHIND the winning ticket. */}
      {currentPick && !running && <Celebration />}

      {/* Held center pick — flies down from the top on reveal, then bobs. */}
      {currentPick && !running && (
        <>
          {/* Sparkles clustered on the winning ticket only. */}
          <Sparkles
            position={CENTER}
            count={40}
            scale={[4.25, 3.4, 1.7]}
            size={4}
            speed={0.4}
            color={palette.secondary}
          >
            <sparklesImplMaterial
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </Sparkles>
          <PaperTicket
            key={currentPick}
            number={currentPick}
            from={TOP}
            target={CENTER}
            scale={1.836}
            float
          />
        </>
      )}

      {/* Wall of picked tickets — each new one flies in from center on mount. */}
      {wall.map(({ entry, target, scale, opacity, hidden }) => (
        !hidden && (
          <PaperTicket
            key={entry}
            number={entry}
            from={CENTER}
            target={target}
            scale={scale}
            opacity={opacity}
          />
        )
      ))}

      <EffectComposer
        multisampling={2}
        stencilBuffer={false}
        frameBufferType={HalfFloatType}
      >
        {/* Sharp band around the held pick (5 units from camera z=11 → ticket
            z=6); emoji burst behind (z 1-4, ~7-10 units) falls outside → blurs.
            bokehScale 0 disables blur when no pick is held. */}
        <DepthOfField
          worldFocusDistance={5}
          worldFocusRange={3}
          bokehScale={0.3}
        />
        <Bloom
          intensity={0.25}
          luminanceSmoothing={0.02}
          luminanceThreshold={0.2}
          mipmapBlur={true}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
        {/* Dither: breaks 8-bit banding rings in the bloom halo on final output. */}
        <Noise
          premultiply
          blendFunction={BlendFunction.SCREEN}
          opacity={0.06}
        />
      </EffectComposer>
    </>
  );
};
