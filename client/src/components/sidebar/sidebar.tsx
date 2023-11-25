import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { Logo } from "./Logo";
import { GiFishingHook } from "react-icons/gi";
import { BiTestTube } from "react-icons/bi";
interface IMenuItem {
  to: string;
  title: string;
  Icon: React.FC<any>;
}

const menus: IMenuItem[] = [
  { to: routes.LIVE, title: "Sniffers", Icon: GiFishingHook },
  { to: routes.TEST_SUITES, title: "Test Suites", Icon: BiTestTube },
];

export const SideBar: React.FC = () => {
  const navigate = useNavigate();

  const onIconClicked = (to: string) => {
    navigate(to);
  };

  return (
    <div className="sticky flex-col bg-primary border-r border-border-color w-[56px] min-w-[56px]">
      <Logo />
      <div className="flex flex-col justify-center items-center py-4 space-y-4">
        {menus.map(({ Icon, to, title }, index) => (
          <div
            onClick={() => onIconClicked(to)}
            key={index}
            className=" cursor-pointer flex flex-col items-center space-y-1"
          >
            <Icon
              key={index}
              className={`text-2xl cursor-pointer hover:scale-110 rounded-md hover:cursor-pointer active:scale-100 w-full text-blue-400`}
              color="text-blue-400"
            />
            <span className="text-white text-[9px]">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
