import React, { PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Navbar } from "../navbar/navbar";
import { SideBar } from "../sidebar/sidebar";
import styles from "./page-template.module.scss";

export const PageTemplate: React.FC<PropsWithChildren> = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user != null && user.email != null) {
      setSideMenuOpen(true);
    } else {
      setSideMenuOpen(false);
    }
  }, [user]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {sideMenuOpen && <SideBar />}
        <div className={styles.page}>
          <Navbar />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};
