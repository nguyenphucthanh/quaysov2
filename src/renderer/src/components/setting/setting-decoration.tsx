import { FormControl } from "@components/ui/form-control";
import { useAnimatedEmoji } from "@hooks/useAnimatedEmoji";
import { useSettingStore } from "@store/setting";
import { FC, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import { useElectronImage } from "@hooks/useElectronImage";
import { cn } from "@lib/utils";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "newYear",
  "golden",
  "sakura",
  "kiddo",
];

export const SettingDecoration: FC = () => {
  const settingStore = useSettingStore();
  const { isAnimating, startAnimation } = useAnimatedEmoji();

  const handleSelectImage = useCallback(async () => {
    // @ts-expected-error electron is defined
    const path = await window.electron.selectImage();
    settingStore.setBackgroundImagePath(path);
  }, [settingStore]);

  const clearImage = () => {
    settingStore.setBackgroundImagePath(null);
  };

  const imagePath = useElectronImage(settingStore?.backgroundImagePath);

  return (
    <div className="flex flex-col gap-4 items-stretch">
      <FormControl label="Theme" name="theme">
        <select
          title="Chọn theme"
          name="theme"
          className="select w-full"
          value={settingStore.theme}
          onChange={(e) => {
            settingStore.setTheme(e.target.value);
          }}
          data-choose-theme
        >
          <option disabled>Theme</option>
          {themes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FormControl>

      <FormControl label="Banner">
        <div className="bg-base-300 p-2 rounded-xl">
          <div className="grid grid-cols-2 gap-2">
            <FormControl label="Trên" name="bannerPosition" className="flex flex-row-reverse gap-2 items-center justify-end">
              <input
                title="Top"
                type="radio"
                name="bannerPosition"
                className="radio"
                checked={settingStore.bannerPosition === "top"}
                onChange={() => settingStore.setBannerPosition("top")}
              />
            </FormControl>
            <FormControl label="Dưới" name="bannerPosition" className="flex gap-2 items-center flex-row-reverse justify-end">
              <input
                title="Bottom"
                type="radio"
                name="bannerPosition"
                className="radio"
                checked={settingStore.bannerPosition === "bottom"}
                onChange={() => settingStore.setBannerPosition("bottom")}
              />
            </FormControl>
          </div>
        </div>
      </FormControl>

      <FormControl label="Độ trong suốt của hộp số" name="boxNumber">
        <input
          title="Độ trong suốt của hộp số"
          type="range"
          min={0}
          max="100"
          step={10}
          value={settingStore.ballotBoxOpacity}
          className="range"
          onChange={(e) => {
            settingStore.setBallotBoxOpacity(parseInt(e.target.value));
          }}
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50</span>
          <span>60</span>
          <span>70</span>
          <span>80</span>
          <span>90</span>
          <span>100</span>
        </div>
      </FormControl>

      <FormControl label="Hiệu ứng chúc mừng" name="congratEffect">
        <div className="bg-base-300 p-2 rounded-xl">
          <div className="flex flex-wrap gap-2 mb-3">
            {settingStore.congratEmojis.map((emoji, index) => (
              <div
                key={index}
                className="p-2 rounded-full bg-base-100 shadow inline-flex gap-2 items-center"
              >
                <span className="text-2xl">{emoji}</span>
                <button
                  title="Delete"
                  className="btn btn-circle btn-sm"
                  onClick={() => {
                    settingStore.setCongratEmojis(
                      settingStore.congratEmojis.filter((e) => e !== emoji)
                    );
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <EmojiPicker
            className="max-w-full"
            width={334}
            onEmojiClick={(emoji) => {
              settingStore.setCongratEmojis([
                ...settingStore.congratEmojis,
                emoji.emoji,
              ]);
            }}
          />
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Kích hoạt hiệu ứng chúc mừng</span>
              <input
                type="checkbox"
                checked={settingStore.enableCongratEffect}
                className="checkbox"
                onChange={(e) => {
                  settingStore.setEnableCongratEffect(e.target.checked);
                }}
                disabled={isAnimating}
              />
            </label>
          </div>
          <button
            className="btn btn-secondary"
            disabled={isAnimating || !settingStore.enableCongratEffect}
            onClick={startAnimation}
          >
            Test
          </button>
        </div>
      </FormControl>

      <FormControl label="Hình nền" name="background">
        <div className="p-2 bg-base-300 rounded-xl flex flex-col gap-2">
          {imagePath && (
            <>
              <div className="relative group">
                <button
                  className="btn btn-circle btn-error absolute z-10 inset-2 left-auto"
                  onClick={clearImage}
                >
                  &times;
                </button>
                <img
                  src={imagePath}
                  alt="Background"
                  className="mb-3 transition-opacity rounded-xl w-full h-auto object-cover shadow group-hover:opacity-75"
                />
              </div>
              <FormControl label="Size" name="size">
                <div className="grid grid-cols-2 gap-2">
                  {["bg-contain", "bg-cover"].map((bg) => (
                    <button
                      className={cn(
                        "btn btn-secondary w-full",
                        settingStore.backgroundSize === bg
                          ? "btn-active"
                          : "btn-outline"
                      )}
                      onClick={() => settingStore.setBackgroundSize(bg)}
                    >
                      {bg.replace("bg-", "")}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormControl label="Position" name="position">
                <div className="grid grid-cols-3 grid-rows-3 gap-2">
                  {[
                    "bg-left-top",
                    "bg-top",
                    "bg-right-top",
                    "bg-left",
                    "bg-center",
                    "bg-right",
                    "bg-left-bottom",
                    "bg-bottom",
                    "bg-right-bottom",
                  ].map((bg) => (
                    <button
                      className={cn(
                        "btn btn-secondary w-full",
                        settingStore.backgroundPosition === bg
                          ? "btn-active"
                          : "btn-outline"
                      )}
                      onClick={() => settingStore.setBackgroundPosition(bg)}
                    >
                      {bg.replace(/-/g, " ").replace("bg", "")}
                    </button>
                  ))}
                </div>
              </FormControl>
            </>
          )}
          <button
            name="background"
            type="button"
            className="btn btn-secondary w-full"
            onClick={handleSelectImage}
          >
            Chọn hình
          </button>
        </div>
      </FormControl>
    </div>
  );
};
