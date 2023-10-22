import GitHubIcon from "@mui/icons-material/GitHub";
import { AppBar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import ThemeToggleMode from "../ThemeToggleMode";
import LoginComponent from "../login-component/login-component";
import styles from "./navbar.module.scss";
import axios from "axios";

export const Navbar: React.FC = () => {
  const { mode, toggleColorMode } = useThemeStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    const repoUrl = "https://api.github.com/repos/sharkio-dev/sharkio";
    axios
      .get(repoUrl)
      .then((response) => {
        const data = response.data;
        const stargazersCount = data.stargazers_count;
        setStarCount(stargazersCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  const isLoggedOut = user == null || user.email == null;

  return (
    <AppBar position="relative">
      <div className={styles.navbar}>
        <div className={styles.navbar_left}>
          {isLoggedOut && (
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
                    navigate("/getting-started");
                  }}
                >
                  Getting started
                </div>
                <div
                  onClick={() => {
                    navigate("/pricing");
                  }}
                >
                  Pricing
                </div>
                <Link
                  to="https://dev.to/sharkio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog
                </Link>
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
          {!isLoggedOut && (
            <>
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
            </>
          )}
          {isLoggedOut && (
            <>
              <a
                className="inline-flex items-center justify-center !leading-none text-center whitespace-nowrap rounded transition-[colors, opacity] duration-200 outline-none uppercase font-medium h-10 px-5 text-xs bg-transparent text-white border border-gray-5 hover:bg-gray-4 hover:border-gray-4 group pl-3"
                href="https://github.com/sharkio-dev/sharkio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 26 26"
                  className="mr-2 h-[26px] w-[26px]"
                >
                  <path
                    fill="#fff"
                    fill-rule="evenodd"
                    d="M13 .324c-7.15 0-13 5.85-13 13 0 5.769 3.737 10.644 8.856 12.35.65.082.894-.244.894-.65V22.83c-3.656.813-4.388-1.706-4.388-1.706-.568-1.462-1.462-1.868-1.462-1.868-1.219-.813.081-.813.081-.813 1.3.081 2.032 1.3 2.032 1.3 1.137 1.95 3.006 1.381 3.818 1.056a2.805 2.805 0 0 1 .813-1.706c-2.925-.325-5.931-1.462-5.931-6.419 0-1.381.487-2.6 1.3-3.494-.163-.325-.57-1.625.162-3.412 0 0 1.056-.325 3.575 1.3 1.056-.325 2.113-.406 3.25-.406s2.194.162 3.25.406c2.519-1.706 3.575-1.381 3.575-1.381.731 1.787.244 3.087.163 3.412.812.894 1.3 2.031 1.3 3.494 0 4.956-3.007 6.094-5.932 6.419.488.406.894 1.218.894 2.437v3.575c0 .325.244.732.894.65C22.263 23.968 26 19.093 26 13.324c0-7.15-5.85-13-13-13Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>Star us</span>
                <span
                  className="flex items-center before:mx-2.5 before:h-[18px] before:w-px before:bg-gray-4 before:transition-colors before:duration-200 group-hover:before:bg-gray-5"
                  aria-label="32 stars on Github"
                >
                  {starCount ? starCount : null}
                </span>
              </a>
            </>
          )}
        </div>
      </div>
    </AppBar>
  );
};
