import React, { PropsWithChildren } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Navbar } from "../navbar/navbar";
import { SideBar } from "../sidebar/sidebar";
import { BiTerminal } from "react-icons/bi";

export const PageTemplate: React.FC<
  PropsWithChildren & { isSideBar?: boolean }
> = ({ children, isSideBar = true }) => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row h-full w-full flex-1">
        {user && isSideBar && <SideBar />}
        <div className="flex flex-col flex-1 bg-tertiary">
          <Navbar />
          {children}
        </div>
      </div>
      {user && <BottomBar />}
    </div>
  );
};

const BottomBar: React.FC = () => {
  return (
    <div className="sticky bottom-0 flex-row w-full bg-secondary h-10 border-t-[0.1px] border-border-color">
      <div className="flex flex-row w-full h-full items-center justify-between px-4">
        <div className="text-[#fff]">© 2023 Sharkio</div>
        <div className="flex flex-row items-center">
          <BiTerminal className="text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110" />
        </div>
      </div>
    </div>
  );
};
