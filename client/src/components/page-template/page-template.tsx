import React, { PropsWithChildren } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Navbar } from "../navbar/navbar";
import { SideBar } from "../sidebar/sidebar";
import { SiOpenai } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import styles from "./page-template.module.scss";

export const PageTemplate: React.FC<
  PropsWithChildren & { isSideBar?: boolean }
> = ({ children, isSideBar = true }) => {
  const { user } = useAuthStore();

  return (
    <div className={styles.pageTemplate}>
      <div className={styles.sidebarContainer}>
        {user && isSideBar && <SideBar />}
      </div>
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>
      <div className={`${styles.contentContainer} bg-tertiary`}>{children}</div>
      <div className={styles.bottomBarContainer}>{user && <BottomBar />}</div>
    </div>
  );
};

const BottomBar: React.FC = () => {
  const navigate = useNavigate();

  const onChatClick = () => {
    navigate("/chat");
  };
  return (
    <div className="sticky bottom-0 flex-row w-full bg-secondary h-10 border-t border-border-color">
      <div className="flex flex-row w-full h-full items-center justify-between px-4">
        <div className="text-[#fff]">© 2023 Sharkio</div>
        <div className="flex flex-row items-center">
          <SiOpenai
            className="text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
            onClick={onChatClick}
          />
        </div>
      </div>
    </div>
  );
};
