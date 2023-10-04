import React from "react";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface ColorModeToggleProps {
  toggleColorMode: () => void;
  isDarkMode: boolean;
}

const ThemeToggleMode: React.FC<ColorModeToggleProps> = ({
  toggleColorMode,
  isDarkMode,
}) => (
  <>
    <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  </>
);

export default ThemeToggleMode;
