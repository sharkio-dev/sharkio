import React, { PropsWithChildren, useState } from "react";
import { SideBar } from "../sidebar/sidebar";
import styles from "./page-template.module.scss";
import { Navbar } from "../navbar/navbar";

export const PageTemplate: React.FC<PropsWithChildren> = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(true);

  const handleMenuIconClicked = () => {
    setSideMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar
          onBurgerClicked={function (): void {
            handleMenuIconClicked();
          }}
        />
      </div>
      <div className={styles.sidebarContainer}>
        {sideMenuOpen && <SideBar className={styles.sidebar}></SideBar>}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
