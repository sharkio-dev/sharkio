import React from "react";
const ENTER_KEY = "Enter";

export const useEnterKeyPress = (callback: () => void, condition: boolean) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ENTER_KEY && condition) {
      callback();
    }
  };

  return handleKeyDown;
};
