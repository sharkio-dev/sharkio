import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from "./navbar.module.scss";
import React from "react";

interface INavbarProps {
  onBurgerClicked: () => void;
}

export const Navbar: React.FC<INavbarProps> = ({ onBurgerClicked }) => {
  return (
    <AppBar position="static">
      <Toolbar className={styles.navbar}>
        <div className={styles.navbar_left}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
            onClick={() => onBurgerClicked?.()}
          >
            <MenuIcon></MenuIcon>
          </IconButton>
          <div className={styles.logo}>
            <a href="/home"><img src="shark-logo.png" alt="Logo"/></a>
          </div>
          <div className={styles.logo_text}>
            SHARKIO
          </div>
        </div>
        <AccountCircleIcon fontSize="large"/>
      </Toolbar>
    </AppBar>
  );
};
