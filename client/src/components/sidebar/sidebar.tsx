import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { Logo } from "./Logo";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { VscTypeHierarchy } from "react-icons/vsc";
import { MdOutlineDashboard } from "react-icons/md";
import { PiGraphLight } from "react-icons/pi";

interface IMenuItem {
  to: string;
  title: string;
  Icon: React.FC<any>;
}

let productionMenu: IMenuItem[] = [
  {
    to: routes.PROXIES,
    title: "Proxies",
    Icon: MdOutlineDashboard,
  },
  {
    to: routes.LIVE_INVOCATIONS,
    title: "Requests",
    Icon: VscTypeHierarchy,
  },
  {
    to: routes.MOCKS,
    title: "Mocks",
    Icon: HiOutlineClipboardDocumentList,
  },
  {
    to: routes.FLOWS,
    title: "Flows",
    Icon: PiGraphLight,
  },
];

const menus: IMenuItem[] = [
  {
    to: routes.ENDPOINTS,
    title: "endpoints",
    Icon: VscTypeHierarchy,
  },
];

// @ts-ignore
if (window._env_.VITE_NODE_ENV !== "production") {
  productionMenu.push(...menus);
}

export const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onIconClicked = (to: string) => {
    navigate({
      pathname: to,
      search: location.search,
    });
  };

  return (
    <div className="h-full sticky flex-col bg-primary border-r border-border-color w-[56px] min-w-[56px]">
      <Logo />
      <div className="flex flex-col justify-center items-center py-4 space-y-4">
        {productionMenu.map(({ Icon, to, title }, index) => (
          <div
            onClick={() => onIconClicked(to)}
            key={index}
            className="cursor-pointer flex flex-col items-center space-y-1"
          >
            <Icon
              key={index}
              className={`text-2xl cursor-pointer hover:scale-110 rounded-md hover:cursor-pointer active:scale-100 w-full ${
                location.pathname.startsWith(to) ||
                (location.pathname === routes.ROOT && to === routes.PROXIES)
                  ? "text-blue-400"
                  : "text-white"
              }`}
              color="text-blue-400"
            />
            <span className="text-white text-[9px]">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
