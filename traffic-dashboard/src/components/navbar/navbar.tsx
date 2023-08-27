import { AppBar } from "@mui/material";
import React from "react";
import styles from "./navbar.module.scss";
import LoginComponent from "../login-component/login-component";
import GitHubIcon from "@mui/icons-material/GitHub";
import ThemeToggleMode from "../ThemeToggleMode";
import { useThemeStore } from "../../stores/themeStore";

export const Navbar: React.FC = () => {
  const { mode, toggleColorMode } = useThemeStore();

  return (
    <AppBar position="relative">
      <div className={styles.navbar}>
        <div className={styles.navbar_left} />
        <div className={styles.navbar_right}>
          <ThemeToggleMode
            toggleColorMode={toggleColorMode}
            isDarkMode={mode === "dark"}
          />
          <a
            className={styles.github_link}
            href="https://github.com/idodav/sharkio"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon fontSize="large" />
          </a>
          <LoginComponent />
        </div>
      </div>
    </AppBar>
  );
};
