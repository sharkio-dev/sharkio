import React from "react";
import { useEffect } from "react";

const ENTER_KEY = "Enter";

export const useEnterKeyPress = (
  onEnter: () => void,
  isValid: boolean = true,
) => {
  const [enterPressed, setEnterPressed] = React.useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === ENTER_KEY && isValid) {
        setEnterPressed(true);
        onEnter();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [onEnter, isValid]);

  return enterPressed;
};
