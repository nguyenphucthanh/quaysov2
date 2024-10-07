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

    get()
      .then(() => {
        console.log("get image success");
      })
      .catch((error) => {
        console.log("get image error", error);
      });
  }, [filePath]);

  return base64;
};
