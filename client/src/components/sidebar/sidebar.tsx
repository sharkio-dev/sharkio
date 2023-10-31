import React from "react";
import { SwapHoriz } from "@mui/icons-material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import { List, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { Logo } from "./Logo";

interface IMenuItem {
  to: string;
  title: string;
  Icon: React.FC;
}

const menus: IMenuItem[] = [
  // { to: routes.HOME, title: "Home", Icon: Home },
  { to: routes.CONFIG, title: "Sniffers", Icon: SettingsInputComponentIcon },
  { to: routes.REQUESTS, title: "Requests", Icon: SwapHoriz },
  { to: routes.MOCKS, title: "Mocks", Icon: DataObjectIcon },
  // { to: routes.OPENAPI, title: "OpenAPI", Icon: ApiIcon },
  // { to: routes.COLLECTION, title: "Collections", Icon: FolderCopyOutlined },
];

export const SideBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky flex-col bg-[#181818] border-r-[0.1px] border-[#3a3a3a]">
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
