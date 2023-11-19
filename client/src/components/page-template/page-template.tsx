import React, { PropsWithChildren } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Navbar } from "../navbar/navbar";
import { SideBar } from "../sidebar/sidebar";
import { SiOpenai } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export const PageTemplate: React.FC<
  PropsWithChildren & { isSideBar?: boolean }
> = ({ children, isSideBar = true }) => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row h-full w-full flex-1">
        {user && isSideBar && <SideBar />}
        <div className="flex flex-col w-full bg-tertiary h-[calc(100vh-40px)]">
          <Navbar />
          {children}
        </div>
      </div>
      {user && <BottomBar />}
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
