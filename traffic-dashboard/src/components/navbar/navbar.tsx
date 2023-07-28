import { AppBar } from "@mui/material";
import React from "react";
import styles from "./navbar.module.scss";
import LoginComponent from "../login-component/login-component";

export const Navbar: React.FC = () => {
  return (
    <AppBar position="relative">
      <div className={styles.navbar}>
        <div className={styles.navbar_left} />
        <LoginComponent />
      </div>
    </AppBar>
  );
};
