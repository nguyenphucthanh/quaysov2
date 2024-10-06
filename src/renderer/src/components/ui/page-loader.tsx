import { FC } from "react";
import { motion } from "framer-motion";
import emoji from "@/assets/images/Beaming Face with Smiling Eyes.png";
export const PageLoader: FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-20 bg-white flex items-center justify-center overflow-hidden"
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: 0,
        translateY: "-100%",
      }}
      transition={{
        type: "spring",
        duration: 0.5,
        delay: 1,
        ease: "circIn",
      }}
      exit={{
        display: "none",
      }}
    >
      <img alt="Loading" src={emoji} />
    </motion.div>
  );
};
