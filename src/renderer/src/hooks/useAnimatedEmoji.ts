import { AnimatedEmojiContext } from "@components/ui/animated-emoji.provider";
import { useContext } from "react";

export const useAnimatedEmoji = () => {
  const context = useContext(AnimatedEmojiContext);
  if (context) {
    const { startAnimation, isAnimating } = context;
    return { startAnimation, isAnimating };
  } else {
    throw new Error("useAnimatedEmoji must be used within a AnimatedEmojiProvider")
  }
};
