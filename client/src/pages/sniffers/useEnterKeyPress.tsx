import { useEffect } from "react";

const ENTER_KEY = "Enter";

export const useEnterKeyPress = (onEnter: () => void) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === ENTER_KEY) {
        onEnter();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [onEnter]);
};
