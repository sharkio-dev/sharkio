export const handleEnterKeyPress =
  (callback: () => void, condition: boolean) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && condition) {
      callback();
    }
  };
