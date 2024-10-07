import {
  createContext,
  FC,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { randomFloatMinMax, randomFromArray, randomMinMax } from "@lib/random";
import { useWindowSize } from "@uidotdev/usehooks";
import { useSettingStore } from "@store/setting";

export type AnimatedEmoji = {
  startAnimation: () => void;
  isAnimating: boolean;
};

export const AnimatedEmojiContext = createContext<AnimatedEmoji>({
  startAnimation: () => {
    console.log("startAnimation");
  },
  isAnimating: false,
});

type FloatEmojiProps = {
  onStart?: () => void;
  onEnd?: () => void;
};

const FloatEmoji: FC<FloatEmojiProps> = ({ onStart, onEnd }) => {
  const id = useId();
  const settingStore = useSettingStore();
  const { width } = useWindowSize();
  const randomEmoji = useMemo(() => {
    const defaultEmojis = ["🥰", "❤", "🎈"];
    const emoji = randomFromArray(
      settingStore.congratEmojis?.length
        ? settingStore.congratEmojis
        : defaultEmojis
    );
    return emoji;
  }, [settingStore.congratEmojis]);
  const randomLeft = useMemo(() => {
    return randomMinMax(0, (width ?? 2000) - 200);
  }, [width]);
  const randomFontSize = useMemo(() => randomMinMax(50, 150), []);
  const randomDelay = useMemo(() => randomFloatMinMax(0, 3), []);
  const randomX = useMemo(() => randomMinMax(0, 100), []);
  const randomDuration = useMemo(() => randomMinMax(1, 3), []);

  return (
    <motion.div
      key={id}
      initial={{
        left: randomLeft,
        fontSize: randomFontSize,
      }}
      animate={{
        scale: [1, 1.2, 1.5, 1.2, 1],
        opacity: [0, 0.7, 1, 0.7, 0],
        top: ["100%", "0%"],
        translateX: [0, `${randomX}%`, 0, `${-randomX}%`, 0],
      }}
      transition={{
        duration: randomDuration,
        ease: "linear",
        delay: randomDelay,
      }}
      className="fixed z-10 pointer-events-none"
      onAnimationStart={onStart}
      onAnimationComplete={onEnd}
    >
      <span
        aria-label="emoji"
        dangerouslySetInnerHTML={{ __html: randomEmoji }}
      ></span>
    </motion.div>
  );
};

export const AnimatedEmojiProvider: FC<React.PropsWithChildren> = ({
  children,
}) => {
  const animations = useRef<number[]>([]);
  const settingStore = useSettingStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    if (!settingStore.enableCongratEffect) {
      return;
    }
    setIsAnimating((prev) => {
      if (!prev) {
        animations.current = [];

        return true;
      }
      return prev;
    });
  }, [settingStore.enableCongratEffect]);

  const onStart = useCallback((id: number) => {
    animations.current.push(id);
  }, []);

  const onEnd = useCallback((id: number) => {
    animations.current = [...animations.current.filter((item) => item !== id)];
    if (animations.current.length === 0) {
      setIsAnimating(false);
    }
  }, []);

  const providedValue = useMemo(() => {
    return {
      startAnimation,
      isAnimating,
    };
  }, [isAnimating, startAnimation]);

  return (
    <AnimatedEmojiContext.Provider value={providedValue}>
      {children}
      {isAnimating && (
        <>
          {Array.from({ length: 20 })
            .map((_, index) => index)
            .map((item) => (
              <FloatEmoji
                key={item}
                onStart={() => onStart(item)}
                onEnd={() => onEnd(item)}
              />
            ))}
        </>
      )}
    </AnimatedEmojiContext.Provider>
  );
};
