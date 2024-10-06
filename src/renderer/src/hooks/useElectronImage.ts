import { useEffect, useState } from "react";

export const useElectronImage = (filePath?: string | null) => {
  const [base64, setBase64] = useState("");

  useEffect(() => {
    const get = async () => {
      if (!filePath) {
        setBase64("");
        return;
      }
      const result = await window.electron.loadImage(filePath);
      setBase64(result);
    };

    get();
  }, [filePath]);

  return base64;
};
