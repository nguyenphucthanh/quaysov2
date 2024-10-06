import { useSettingStore } from "@store/setting";
import { cva } from "class-variance-authority";
import { FC } from "react";
const boxClasses = cva(
  [
    "p-4",
    "flex",
    "flex-col",
    "gap-3",
    "items-center",
    "w-auto",
    "rounded-xl",
    "bg-base-100",
    "overflow-hidden",
  ],
  {
    variants: {
      position: {
        top: "",
        bottom: "order-1",
      },
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

// type BallotBoxOpacity =
//   | 0
//   | 10
//   | 20
//   | 30
//   | 40
//   | 50
//   | 60
//   | 70
//   | 80
//   | 90
//   | 100
//   | undefined
//   | null;

export const Banner: FC = () => {
  const settingStore = useSettingStore();
  const html = settingStore.banner.replace(/\r?\n/g, "<br/>");
  if (!html) {
    return null;
  }
  return (
    <div className={boxClasses({ position: settingStore.bannerPosition })}>
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </div>
  );
};
