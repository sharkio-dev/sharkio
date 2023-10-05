import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  FolderCopyOutlined,
  Home,
  SwapHoriz,
} from "@mui/icons-material";
import ApiIcon from "@mui/icons-material/Api";
import DataObjectIcon from "@mui/icons-material/DataObject";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import { IconButton, List, ListItemButton, Paper } from "@mui/material";
import c from "classnames";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./sidebar.module.scss";
import { routes } from "../../constants/routes";

const Logo: React.FC<{ minimized: boolean }> = ({ minimized }) => {
  return (
    <div
      className={c({
        [styles.sharkioContainer]: true,
      })}
    >
      <div className={styles.logo}>
        <a href="/home">
          <img src="shark-logo.png" alt="Logo" />
        </a>
      </div>
      {!minimized && <div className={styles.logoText}>𝐒𝐡𝐚𝐫𝐤𝐢𝐨</div>}
    </div>
  );
};

const Toggle: React.FC<{
  minimized: boolean;
  handleMenuIconClicked: () => void;
}> = ({ minimized, handleMenuIconClicked }) => {
  return (
    <div className={styles.toggleMenu} onClick={handleMenuIconClicked}>
      <IconButton>{minimized ? <ChevronRight /> : <ChevronLeft />}</IconButton>
    </div>
  );
};
interface IMenuItem {
  to: string;
  title: string;
  Icon: React.FC;
}
const menus: IMenuItem[] = [
  { to: routes.HOME, title: "Home", Icon: Home },
  { to: routes.CONFIG, title: "Sniffers", Icon: SettingsInputComponentIcon },
  { to: routes.REQUESTS, title: "Requests", Icon: SwapHoriz },
  { to: routes.MOCKS, title: "Mocks", Icon: DataObjectIcon },
  { to: routes.OPENAPI, title: "OpenAPI", Icon: ApiIcon },
  { to: routes.COLLECTION, title: "Collections", Icon: FolderCopyOutlined },
];

export const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);

  const handleMenuIconClicked = () => {
    setMinimized((prev) => !prev);
  };

  return (
    <div
      className={c({
        [styles.sidebarContainer]: true,
        [styles.sidebarContainerMinimized]: minimized,
      })}
    >
      <Paper className={styles.paper} elevation={8}>
        <Logo minimized={minimized} />

        <List>
          <Toggle
            minimized={minimized}
            handleMenuIconClicked={handleMenuIconClicked}
          />
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
              className={c({
                [styles.listItem]: true,
                [styles.listItemMinimized]: minimized,
              })}
            >
              <Icon />
              {!minimized && <>{title}</>}
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </div>
  );
};
