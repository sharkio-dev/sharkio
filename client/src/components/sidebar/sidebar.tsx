import React from "react";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import { ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { Logo } from "./Logo";

interface IMenuItem {
  to: string;
  title: string;
  Icon: React.FC;
}

const menus: IMenuItem[] = [
  { to: routes.SNIFFERS, title: "Sniffers", Icon: SettingsInputComponentIcon },
];

export const SideBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky flex-col bg-primary border-r-[0.1px] border-border-color">
      <Logo />
      <div className="flex flex-col justify-center items-center ">
        {menus.map(({ to, title, Icon }) => (
          <ListItemButton
            key={title}
            onClick={() => {
              navigate(to);
            }}
            selected={
              to === location.pathname ||
              (to === "/home" && "/" === location.pathname)
            }
          >
            <Icon />
          </ListItemButton>
        ))}
      </div>
    </div>
  );
};
