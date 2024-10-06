import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SettingStore = {
  theme: string;
  setTheme: (theme: string) => void;
  title1: string;
  setTitle1: (title1: string) => void;
  title2: string;
  setTitle2: (title2: string) => void;
  startLabel: string;
  setStartLabel: (startLabel: string) => void;
  stopLabel: string;
  setStopLabel: (stopLabel: string) => void;
  numberRange: [number, number];
  setNumberRange: (numberRange: [number, number]) => void;
  banner: string;
  setBanner: (banner: string) => void;
  bannerPosition: "top" | "bottom";
  setBannerPosition: (bannerPosition: "top" | "bottom") => void;
  ballotBoxOpacity: number;
  setBallotBoxOpacity: (ballotBoxOpacity: number) => void;
  congratEmojis: string[];
  setCongratEmojis: (congratEmojis: string[]) => void;
  enableCongratEffect: boolean;
  setEnableCongratEffect: (enableCongratEffect: boolean) => void;
  backgroundImagePath: string | null;
  setBackgroundImagePath: (backgroundImagePath: string | null) => void;
  backgroundSize: string;
  setBackgroundSize: (backgroundSize: string) => void;
  backgroundPosition: string;
  setBackgroundPosition: (backgroundPosition: string) => void;
};

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      theme: "valentine",
      setTheme: (theme: string) => set({ theme }),
      title1: "Quay số",
      setTitle1: (title1: string) => set({ title1 }),
      title2: "Ngày Xuân",
      setTitle2: (title2: string) => set({ title2 }),
      startLabel: "Bắt đầu",
      setStartLabel: (startLabel: string) =>
        set({ startLabel: startLabel ?? "START" }),
      stopLabel: "Dừng",
      setStopLabel: (stopLabel: string) =>
        set({ stopLabel: stopLabel ?? "STOP" }),
      numberRange: [0, 99],
      setNumberRange: (numberRange: [number, number]) => set({ numberRange }),
      banner: "",
      setBanner: (banner: string) => set({ banner }),
      bannerPosition: "top",
      setBannerPosition: (bannerPosition: "top" | "bottom") =>
        set({ bannerPosition }),
      ballotBoxOpacity: 50,
      setBallotBoxOpacity: (ballotBoxOpacity: number) =>
        set({ ballotBoxOpacity }),
      congratEmojis: ["🥰", "❤", "🎈"],
      setCongratEmojis: (congratEmojis: string[]) => set({ congratEmojis }),
      enableCongratEffect: true,
      setEnableCongratEffect: (enableCongratEffect: boolean) =>
        set({ enableCongratEffect }),
      backgroundImagePath: null,
      setBackgroundImagePath: (backgroundImagePath: string | null) =>
        set({ backgroundImagePath }),
      backgroundSize: "bg-cover",
      setBackgroundSize: (backgroundSize: string) => set({ backgroundSize }),
      backgroundPosition: "bg-center",
      setBackgroundPosition: (backgroundPosition: string) =>
        set({ backgroundPosition }),
    }),
    {
      name: "setting-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
