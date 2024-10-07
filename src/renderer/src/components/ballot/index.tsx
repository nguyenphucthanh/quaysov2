import { FC, useCallback, useRef, useState } from "react";
import lotterySound from "@/assets/sounds/lottery.mp3";
import tadaSound from "@/assets/sounds/tada.mp3";
import { cva } from "class-variance-authority";
import { useSettingStore } from "@store/setting";
import { useLotteryStore } from "@store/lottery";
import { cn } from "@lib/utils";
import { useAnimatedEmoji } from "@hooks/useAnimatedEmoji";
import { motion } from "framer-motion";
import { BorderBeam } from "@components/ui/border-beam";

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
  ],
  {
    variants: {
      state: {
        running: ["btn-secondary", "ring-secondary/30"],
        stopped: ["btn-primary", "ring-primary/30"],
      },
    },
    defaultVariants: {
      state: "stopped",
    },
  }
);

const boxClasses = cva(
  [
    "p-10",
    "flex",
    "flex-col",
    "gap-3",
    "items-center",
    "w-auto",
    "rounded-3xl",
    "bg-base-100",
    "overflow-hidden",
    "relative",
    "min-w-[500px]",
    "min-h-[400px]",
  ],
  {
    variants: {
      opacity: {
        0: ["bg-opacity-0"],
        10: ["bg-opacity-10"],
        20: ["bg-opacity-20"],
        30: ["bg-opacity-30"],
        40: ["bg-opacity-40"],
        50: ["bg-opacity-50"],
        60: ["bg-opacity-60"],
        70: ["bg-opacity-70"],
        80: ["bg-opacity-80"],
        90: ["bg-opacity-90"],
        100: ["bg-opacity-100"],
      },
    },
    defaultVariants: {
      opacity: 50,
    },
    compoundVariants: [
      {
        opacity: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        className: ["backdrop-blur-md", "shadow-2xl"],
      },
    ],
  }
);

type BallotBoxOpacity =
  | 0
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 100
  | undefined
  | null;

export type BallotProps = {
  zeroPrefix: boolean;
  numberLength?: number;
};

const genNumber = (
  min: number,
  max: number,
  zeroPrefix: boolean,
  lengthOfNumber: number
): string => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  const numString = zeroPrefix
    ? num.toString().padStart(lengthOfNumber, "0")
    : num.toString();
  return numString;
};

export const Ballot: FC<BallotProps> = ({ zeroPrefix, numberLength }) => {
  const settingStore = useSettingStore();
  const lotteryStore = useLotteryStore();
  const { startAnimation } = useAnimatedEmoji();
  const [number, setNumber] = useState("000000");
  const [runInterval, setRunInterval] = useState<NodeJS.Timeout | null>(null);
  const ballotSoundRef = useRef<HTMLAudioElement | null>();
  const tadahSoundRef = useRef<HTMLAudioElement | null>();
  const onStop = useCallback(() => {
    lotteryStore.addHistory(number);
  }, [lotteryStore, number]);
  const [min, max] = settingStore.numberRange;

  const isRangeValid = min < max;

  const start = useCallback(async () => {
    const lengthOfNumber = numberLength ?? max.toString().length;
    const interval = setInterval(() => {
      let numString = genNumber(min, max, zeroPrefix, lengthOfNumber);
      while (lotteryStore.history.includes(numString)) {
        numString = genNumber(min, max, zeroPrefix, lengthOfNumber);
      }
      setNumber(numString);
    }, 100);
    setRunInterval(interval);

    if (ballotSoundRef.current) {
      ballotSoundRef.current.currentTime = 0;
      await ballotSoundRef.current?.play();
    }
  }, [lotteryStore.history, max, min, numberLength, zeroPrefix]);

  const stop = useCallback(async () => {
    if (runInterval) {
      clearInterval(runInterval);
      setRunInterval(null);

      // seek audio at 0
      if (ballotSoundRef.current) {
        ballotSoundRef.current.pause();
        ballotSoundRef.current.currentTime = 0;
      }

      if (tadahSoundRef.current) {
        tadahSoundRef.current.currentTime = 0;
        await tadahSoundRef.current.play();
      }

      onStop();
      startAnimation();
    }
  }, [runInterval, onStop, startAnimation]);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: -100, scale: 0.8 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "spring",
        delay: 1,
        duration: 1,
        ease: "easeIn",
        bounce: 0.5,
      }}
      className={boxClasses({
        opacity: settingStore.ballotBoxOpacity as BallotBoxOpacity,
      })}
    >
      {settingStore.title1 && (
        <h2 className="font-sans font-semibold text-3xl text-secondary">
          {settingStore.title1}
        </h2>
      )}
      {settingStore.title2 && (
        <h1 className="font-serif uppercase text-5xl font-bold text-primary">
          {settingStore.title2}
        </h1>
      )}
      <div
        className={cn(
          "text-9xl font-extrabold text-center p-10 text-primary drop-shadow-md font-mono"
        )}
      >
        {number}
      </div>
      <div className="relative">
        <button
          className={buttonClasses({
            state: runInterval ? "running" : "stopped",
          })}
          onClick={() => {
            if (runInterval) {
              stop()
                .then(() => {
                  console.log("stop");
                })
                .catch((error) => {
                  console.log("stop error", error);
                });
            } else {
              start()
                .then(() => {
                  console.log("start");
                })
                .catch((error) => {
                  console.log("start error", error);
                });
            }
          }}
          disabled={!isRangeValid}
        >
          {runInterval ? settingStore.stopLabel : settingStore.startLabel}
        </button>
      </div>
      {!isRangeValid && (
        <p className="text-xs text-error ">
          <label htmlFor="main-drawer" className="p-4 cursor-pointer block">
            Hãy vào mục setting để điều chỉnh dãy số
          </label>
        </p>
      )}
      <div className="w-0 h-0 invisible">
        <audio
          preload="auto"
          src={lotterySound}
          ref={(ref) => {
            ballotSoundRef.current = ref;
          }}
          loop={true}
        />
        <audio
          preload="auto"
          src={tadaSound}
          ref={(ref) => {
            tadahSoundRef.current = ref;
          }}
        />
      </div>
      {runInterval ? null : (
        <BorderBeam borderWidth={5} size={300} duration={5} />
      )}
    </motion.div>
  );
};
