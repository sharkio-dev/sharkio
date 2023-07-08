import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppBar } from "@mui/material";
import React from "react";
import styles from "./navbar.module.scss";

export const Navbar: React.FC = () => {
  return (
    <AppBar position="relative">
      <div className={styles.navbar}>
        <div className={styles.navbar_left}>
          <div className={styles.logo}>
            <a href="/home">
              <img src="shark-logo.png" alt="Logo" />
            </a>
          </div>
          <div className={styles.logo_text}>SHARKIO</div>
        </div>
        <AccountCircleIcon fontSize="large" />
      </div>
    </AppBar>
  );
};
