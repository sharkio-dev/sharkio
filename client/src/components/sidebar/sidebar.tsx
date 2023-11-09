import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { Logo } from "./Logo";
import { GiFishingHook } from "react-icons/gi";

interface IMenuItem {
  to: string;
  title: string;
  Icon: React.FC<any>;
}

const menus: IMenuItem[] = [
  { to: routes.LIVE, title: "Sniffers", Icon: GiFishingHook },
];

export const SideBar: React.FC = () => {
  const navigate = useNavigate();

  const onIconClicked = (to: string) => {
    navigate(to);
  };

  return (
    <div className="sticky flex-col bg-primary border-r-[0.1px] border-border-color w-[56px]">
      <Logo />
      <div className="flex flex-col justify-center items-center py-4 space-y-4">
        {menus.map(({ Icon, to }, index) => (
          <Icon
            key={index}
            className={`text-2xl cursor-pointer hover:scale-110 rounded-md hover:cursor-pointer active:scale-100 w-full text-blue-200`}
            onClick={() => onIconClicked(to)}
          />
        ))}
      </div>
    </div>
  );
};
