import { cn } from "@lib/utils";
import { useLotteryStore } from "@store/lottery";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

const itemHeight = 36;

export const History: FC = () => {
  const store = useLotteryStore();
  const ulRef = useRef<HTMLUListElement | null>(null);

  const reversedHistory = useMemo(
    () => store.history.slice().reverse(),
    [store.history]
  );

  const onDelete = useCallback(() => {
    store.reset();
  }, [store]);

  useEffect(() => {
    ulRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [store.history.length]);

  return (
    <motion.div
      className="w-48 flex flex-col items-stretch justify-start gap-5 p-5 fixed right-0 shadow-lg bg-base-100 text-base-content bg-opacity-70 backdrop-blur rounded-2xl rounded-r-none scroll-smooth"
      initial={{ opacity: 0, translateX: "100%", scale: 0.5 }}
      animate={{ opacity: 1, translateX: 0, scale: 1 }}
      transition={{
        duration: 1,
        delay: 1,
        ease: "anticipate",
        type: "spring",
        bounce: 0.5,
      }}
    >
      <h1 className="text-xl font-bold text-base-content text-center">
        Danh sách số
      </h1>
      <ul
        className={cn(
          "flex flex-col items-center gap-2 overflow-auto p-3 scroll-pt-3 scroll-smooth snap-mandatory snap-y",
          "h-[220px]"
        )}
        ref={(ref) => (ulRef.current = ref)}
      >
        {reversedHistory.map((entry, index) => (
          <motion.li
            initial={{ opacity: 0, scale: 0.5, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: itemHeight }}
            transition={{ duration: 0.5, ease: "backIn" }}
            key={entry}
            className={cn(
              "font-bold text-3xl font-mono snap-start",
              index === 0 ? "text-primary" : "text-base-content"
            )}
          >
            {entry}
          </motion.li>
        ))}
      </ul>
      <button onClick={onDelete} className="btn w-full btn-neutral">
        Xóa lịch sử
      </button>
    </motion.div>
  );
};
