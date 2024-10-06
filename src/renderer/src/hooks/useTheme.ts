import { useSettingStore } from "@store/setting";
import { useEffect } from "react";
import { themeChange } from "theme-change";

export const useTheme = () => {
  const settingStore = useSettingStore();

  useEffect(() => {
    themeChange(false);
  }, [settingStore.theme]);
};
