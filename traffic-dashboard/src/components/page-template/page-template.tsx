import { Login, Search } from "@mui/icons-material";
import { AppBar, Paper } from "@mui/material";
import React, { PropsWithChildren, useState } from "react";
import { SideBar } from "../sidebar/sidebar";
import styles from "./page-template.module.scss";
import { Navbar } from "../navbar/navbar";

export const PageTemplate: React.FC<PropsWithChildren> = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(true);

  return (
    <>
      <Navbar></Navbar>
      <div className={styles.container}>
        {sideMenuOpen && <SideBar className={styles.sidebar} />}
        <div className={styles.page}>
          <div className={styles.appBar}></div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>
  );
};
