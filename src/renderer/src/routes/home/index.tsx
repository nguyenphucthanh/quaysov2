import { Ballot } from "@components/ballot";
import { Banner } from "@components/banner";
import { History } from "@components/history";
import { Setting } from "@components/setting";
import { AnimatedEmojiProvider } from "@components/ui/animated-emoji.provider";
import { GearIcon } from "@radix-ui/react-icons";
import { FC } from "react";

const HomePage: FC = () => {
  return (
    <AnimatedEmojiProvider>
      <div className="drawer h-full w-full">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content w-full h-full flex flex-col items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <Banner />
            <Ballot zeroPrefix />
            <History />
          </div>
          <label
            htmlFor="main-drawer"
            className="group btn btn-neutral drawer-button absolute top-4 left-4"
          >
            <GearIcon className="group-hover:animate-spin" />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="main-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="w-96 min-h-full bg-base-200 text-base-content p-0">
            {/* Sidebar content here */}
            <Setting />
          </div>
        </div>
      </div>
    </AnimatedEmojiProvider>
  );
};

export default HomePage;
