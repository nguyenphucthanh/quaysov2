import { BallotScene } from "@components/ballot-scene";
import { Banner } from "@components/banner";
import { Setting } from "@components/setting";
import { AnimatedEmojiProvider } from "@components/ui/animated-emoji.provider";
import { GearIcon } from "@radix-ui/react-icons";
import { FC } from "react";

const HomePage: FC = () => {
  return (
    <AnimatedEmojiProvider>
      <div className="drawer h-full w-full">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content w-full h-full relative overflow-hidden">
          <BallotScene />
          <div className="pointer-events-none absolute top-0 left-0 right-0 flex justify-center p-4 z-10">
            <Banner />
          </div>
          <label
            htmlFor="main-drawer"
            className="group btn btn-neutral drawer-button absolute top-4 left-4 z-10"
          >
            <GearIcon className="group-hover:animate-spin" />
          </label>
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="main-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="w-96 min-h-full bg-base-200 text-base-content p-0">
            <Setting />
          </div>
        </div>
      </div>
    </AnimatedEmojiProvider>
  );
};

export default HomePage;
