import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/home";
import { useTheme } from "@hooks/useTheme";
import { useSettingStore } from "@store/setting";
import { useElectronImage } from "@hooks/useElectronImage";
import { PageLoader } from "@components/ui/page-loader";
import { useMemo } from "react";
import { cn } from "@lib/utils";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

function App() {
  useTheme();
  const settingStore = useSettingStore();
  const background = useElectronImage(settingStore?.backgroundImagePath);
  const style = useMemo(() => {
    const styles: React.CSSProperties = {};
    if (background) {
      styles.backgroundImage = `url(${background})`;
    }
    return styles;
  }, [background]);

  return (
    <div
      className={cn("h-dvh w-dvw p-5 bg-gradient-to-br from-accent to-secondary", settingStore.backgroundSize, settingStore.backgroundPosition)}
      style={style}
    >
      <PageLoader />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
