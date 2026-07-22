import { FC, useCallback, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { cva } from "class-variance-authority";
import lotterySound from "@/assets/sounds/drum.wav";
import windSound from "@/assets/sounds/wind.wav";
import tadaSound from "@/assets/sounds/tada.mp3";
import { useSettingStore } from "@store/setting";
import { useLotteryStore } from "@store/lottery";
import { Scene } from "./scene";

const buttonClasses = cva(
  [
    "btn",
    "btn-wide",
    "btn-lg",
    "font-bold",
    "outline-0",
    "focus:outline-0",
    "transition-all",
    "rounded-full",
    "ring-8",
    "pointer-events-auto",
  ],
  {
    variants: {
      state: {
        running: ["btn-secondary", "ring-secondary/30"],
        stopped: ["btn-primary", "ring-primary/30"],
      },
    },
    defaultVariants: { state: "stopped" },
  }
);

export const BallotScene: FC = () => {
  const settingStore = useSettingStore();
  const lotteryStore = useLotteryStore();

  const [running, setRunning] = useState(false);
  const [currentPick, setCurrentPick] = useState<string | null>(null);

  const lotterySoundRef = useRef<HTMLAudioElement | null>(null);
  const windSoundRef = useRef<HTMLAudioElement | null>(null);
  const tadaSoundRef = useRef<HTMLAudioElement | null>(null);

  const [min, max] = settingStore.numberRange;
  const isRangeValid = min < max;

  const remainingNumbers = useMemo(() => {
    if (!isRangeValid) return [];
    const drawn = new Set(lotteryStore.history);
    if (currentPick) drawn.add(currentPick);
    const lengthOfNumber = max.toString().length;
    const available: string[] = [];
    for (let i = min; i <= max; i++) {
      const numStr = i.toString().padStart(lengthOfNumber, "0");
      if (!drawn.has(numStr)) {
        available.push(numStr);
      }
    }
    return available;
  }, [isRangeValid, min, max, lotteryStore.history, currentPick]);

  const isExhausted = isRangeValid && remainingNumbers.length === 0;

  const start = useCallback(async () => {
    if (remainingNumbers.length === 0) return;
    // Commit the previously revealed pick → it flies to the wall.
    if (currentPick) {
      lotteryStore.addHistory(currentPick);
      setCurrentPick(null);
    }
    setRunning(true);
    if (windSoundRef.current) {
      windSoundRef.current.currentTime = 0;
      void windSoundRef.current.play();
    }
    if (lotterySoundRef.current) {
      lotterySoundRef.current.currentTime = 0;
      await lotterySoundRef.current.play();
    }
  }, [currentPick, lotteryStore, remainingNumbers.length]);

  const stop = useCallback(async () => {
    if (remainingNumbers.length === 0) {
      setRunning(false);
      if (lotterySoundRef.current) {
        lotterySoundRef.current.pause();
        lotterySoundRef.current.currentTime = 0;
      }
      if (windSoundRef.current) {
        windSoundRef.current.pause();
        windSoundRef.current.currentTime = 0;
      }
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    const numString = remainingNumbers[randomIndex];
    setCurrentPick(numString);
    setRunning(false);

    if (lotterySoundRef.current) {
      lotterySoundRef.current.pause();
      lotterySoundRef.current.currentTime = 0;
    }
    if (windSoundRef.current) {
      windSoundRef.current.pause();
      windSoundRef.current.currentTime = 0;
    }
    if (tadaSoundRef.current) {
      tadaSoundRef.current.currentTime = 0;
      await tadaSoundRef.current.play();
    }
  }, [remainingNumbers]);

  return (
    <div className="absolute inset-0">
      <Canvas
        className="!absolute inset-0 pointer-events-none"
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 11], fov: 50 }}
        gl={{ alpha: true, antialias: true, stencil: false, powerPreference: "high-performance" }}
      >
        <Scene
          running={running}
          currentPick={currentPick}
          history={lotteryStore.history}
          theme={settingStore.theme}
          title1={settingStore.title1}
          title2={settingStore.title2}
          fogOpacity={settingStore.ballotBoxOpacity}
        />
      </Canvas>

      {/* HTML overlay: start/stop + clear, per hybrid spec. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-16 gap-3">
        <button
          className={buttonClasses({ state: running ? "running" : "stopped" })}
          disabled={!isRangeValid || (!running && isExhausted)}
          onClick={() => {
            const run = running ? stop() : start();
            run.catch((e) => console.log("ballot error", e));
          }}
        >
          {running ? settingStore.stopLabel : settingStore.startLabel}
        </button>
        {!isRangeValid && (
          <label
            htmlFor="main-drawer"
            className="pointer-events-auto text-xs text-error cursor-pointer"
          >
            Hãy vào mục setting để điều chỉnh dãy số
          </label>
        )}
        {isRangeValid && isExhausted && !running && (
          <p className="pointer-events-auto text-xs text-warning">
            Đã quay hết tất cả các số trong dãy!
          </p>
        )}
      </div>

      {lotteryStore.history.length > 0 && (
        <button
          onClick={() => lotteryStore.reset()}
          className="btn btn-sm btn-neutral pointer-events-auto absolute bottom-4 right-4"
        >
          Xóa lịch sử
        </button>
      )}

      <div className="w-0 h-0 invisible">
        <audio preload="auto" src={lotterySound} loop ref={lotterySoundRef} />
        <audio preload="auto" src={windSound} loop ref={windSoundRef} />
        <audio preload="auto" src={tadaSound} ref={tadaSoundRef} />
      </div>
    </div>
  );
};
