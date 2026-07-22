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
      className={cn(
        "h-dvh w-dvw bg-gradient-to-br from-accent to-secondary",
        settingStore.backgroundSize,
        settingStore.backgroundPosition,
      )}
      style={style}
    >
      {/* Noise dither pattern overlay using static image to prevent dynamic SVG filter re-rasterization */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3d5eXl8fHx4eXl9fX12dnZ1dXWBgYB0dHRze3t1dnZzc3NydHRzc3N1dXVycnJzdHVydHRzcnJzc3N1dXZyc3NydHRzc3NydHR62T3LAAAAB3RSTlMAAwQFBgcICQpT8QAAAD5JREFUeN7t1LENADAMAzL233x79AoERB1kQJ6cM1P2Cquqpqqpqpqqpqpqqpqpqqpqpqqpqpqqpqqpqpqq6g1b7gMUAO51GwAAAABJRU5ErkJggg==')",
          backgroundRepeat: "repeat",
        }}
      />
      <PageLoader />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
