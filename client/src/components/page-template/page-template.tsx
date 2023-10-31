import React, { PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Navbar } from "../navbar/navbar";
import { SideBar } from "../sidebar/sidebar";

export type Sniffer = {
  name: string;
  id: string;
  downstreamUrl: string;
  port: number;
};

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
    <div className="flex flex-row h-full w-full min-h-screen">
      {sideMenuOpen && <SideBar />}
      <div className="flex flex-col flex-1 bg-[#1d1d1d]">
        <Navbar />
        {children}
      </div>
    </div>
  );
};
