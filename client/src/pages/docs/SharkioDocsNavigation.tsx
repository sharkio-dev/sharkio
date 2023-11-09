import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

type SharkioDocsNavigationProps = {
  navigationItems: { title: string; path: string; icon: React.ReactNode }[];
};
export const SharkioDocsNavigation = ({
  navigationItems,
}: SharkioDocsNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex-col w-1/5 border-r bg-secondary border-border-color hidden sm:flex sm:w-1/4 lg:w-1/5">
      {navigationItems.map(({ title, path, icon }) => (
        <div
          key={title}
          className={`flex text-lg font-serif text-center items-center border-b border-border-color hover:cursor-pointer hover:bg-tertiary 
          
            `}
          onClick={() => onClick(path)}
        >
          <div className="flex flex-1 active:scale-95 px-4 py-2 items-center">
            <div
              className={`${location.pathname === path ? "text-blue-300" : ""}`}
            >
              {icon}
            </div>
            {title}
          </div>
        </div>
      ))}
    </div>
  );
};
