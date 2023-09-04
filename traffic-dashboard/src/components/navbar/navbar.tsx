import GitHubIcon from "@mui/icons-material/GitHub";
import { AppBar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../stores/themeStore";
import ThemeToggleMode from "../ThemeToggleMode";
import LoginComponent from "../login-component/login-component";
import styles from "./navbar.module.scss";
import { useAuthStore } from "../../stores/authStore";

export const Navbar: React.FC = () => {
  const { mode, toggleColorMode } = useThemeStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <AppBar position="relative">
      <div className={styles.navbar}>
        <div className={styles.navbar_left}>
          {(user == null || user.email == null) && (
            <>
              <div className="flex flex-row justify-center content-center gap-3 mr-10">
                <div>
                  <a href="/">
                    <img
                      src="shark-logo.png"
                      alt="Logo"
                      className="w-10 h-10 rounded-full"
                    />
                  </a>
                </div>

                <div className={"flex flex-row items-center"}>𝐒𝐡𝐚𝐫𝐤𝐢𝐨</div>
              </div>
              <div className="flex flex-row gap-10 cursor-pointer">
                <div
                  onClick={() => {
                    navigate("/pricing");
                  }}
                >
                  Pricing
                </div>
                <div
                  onClick={() => {
                    navigate("/getting-started");
                  }}
                >
                  Getting started
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </div>
              </div>
            </>
          )}
        </div>
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
