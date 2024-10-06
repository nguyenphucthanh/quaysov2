import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LotteryStore = {
  history: string[];
  addHistory: (entry: string) => void;
  reset: () => void;
};

export const useLotteryStore = create<LotteryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addHistory: (entry: string) =>
        set({ history: [...get().history, entry] }),
      reset: () => set({ history: [] }),
    }),
    {
      name: "lottery-store",
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

