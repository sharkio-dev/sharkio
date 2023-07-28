import { AppBar } from "@mui/material";
import React from "react";
import styles from "./navbar.module.scss";
import LoginComponent from "../LoginComponent/login-component";
import GitHubIcon from "@mui/icons-material/GitHub";
export const Navbar: React.FC = () => {
  return (
    <AppBar position="relative">
      <div className={styles.navbar}>
        <div className={styles.navbar_left} />
        <div className={styles.navbar_right}>
          <a
            className={styles.github_link}
            href="https://github.com/idodav/sharkio"
            target="_blank"
          >
            <GitHubIcon fontSize="large" />
          </a>
          <LoginComponent />
        </div>
      </div>
    </AppBar>
  );
};
