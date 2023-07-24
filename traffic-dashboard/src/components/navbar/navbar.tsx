import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppBar } from "@mui/material";
import React from "react";
import styles from "./navbar.module.scss";

export const Navbar: React.FC = () => {
  return (
    <AppBar position="relative">
      <div className={styles.navbar}>
        <div></div>
        <AccountCircleIcon fontSize="large" />
      </div>
    </AppBar>
  );
};
