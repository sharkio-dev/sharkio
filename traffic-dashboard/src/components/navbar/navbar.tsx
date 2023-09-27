import GitHubIcon from "@mui/icons-material/GitHub";
import { AppBar } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import ThemeToggleMode from "../ThemeToggleMode";
import LoginComponent from "../login-component/login-component";
import styles from "./navbar.module.scss";
import SvgIcon from "@mui/material/SvgIcon";

export const Navbar: React.FC = () => {
  const { mode, toggleColorMode } = useThemeStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const disablesupabase = import.meta.env.VITE_DISABLE_SUPABASE;

  const isLoggedOut = disablesupabase
    ? false
    : user == null || user.email == null;

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
                href="https://discord.gg/78KY7GW2WW"
                className={styles.discord_icon}
              >
                <SvgIcon>
                  <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.2.38-.44.87-.6 1.25a18.27 18.27 0 0 0-5.5 0c-.16-.4-.4-.87-.6-1.25a.08.08 0 0 0-.09-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.04.03A20.26 20.26 0 0 0 .1 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.02c.46-.63.87-1.3 1.22-2a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1 0-.12l.36-.3a.07.07 0 0 1 .08 0 14.2 14.2 0 0 0 12.06 0 .07.07 0 0 1 .08 0l.37.3a.08.08 0 0 1 0 .12 12.3 12.3 0 0 1-1.88.9.08.08 0 0 0-.04.1c.36.7.78 1.36 1.23 2a.08.08 0 0 0 .08.02c1.96-.6 3.95-1.52 6-3.03a.08.08 0 0 0 .04-.05c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42Z" />
                </SvgIcon>
              </a>
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
                class="inline-flex items-center justify-center !leading-none text-center whitespace-nowrap rounded transition-[colors, opacity] duration-200 outline-none uppercase font-medium h-10 px-5 text-xs bg-transparent text-white border border-gray-5 hover:bg-gray-4 hover:border-gray-4 group pl-3"
                href="https://github.com/sharkio-dev/sharkio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 26 26"
                  class="mr-2 h-[26px] w-[26px]"
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
                  class="flex items-center before:mx-2.5 before:h-[18px] before:w-px before:bg-gray-4 before:transition-colors before:duration-200 group-hover:before:bg-gray-5"
                  aria-label="32 stars on Github"
                >
                  32
                </span>
              </a>
            </>
          )}
        </div>
      </div>
    </AppBar>
  );
};
