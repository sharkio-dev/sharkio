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
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import c from "classnames";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./sidebar.module.scss";
import { routes } from "../../constants/routes";

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

        <List>
          <div className={styles.toggleMenu} onClick={handleMenuIconClicked}>
            <IconButton>
              {minimized ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </div>
          <ListItemButton
            onClick={() => {
              navigate("/home");
            }}
            selected={
              "/home" === location.pathname || "/" === location.pathname
            }
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
          >
            <Home />
            {!minimized && <>Home</>}
          </ListItemButton>
          <ListItemButton
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
            selected={"/config" === location.pathname}
            onClick={() => {
              navigate("/config");
            }}
          >
            <SettingsInputComponentIcon />
            {!minimized && <>Services</>}
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/requests");
            }}
            selected={"/requests" === location.pathname}
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
          >
            <SwapHoriz />
            {!minimized && <>Requests</>}
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/mocks");
            }}
            selected={"/mocks" === location.pathname}
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
          >
            <DataObjectIcon />
            {!minimized && <>Mocks</>}
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/gen-openapi");
            }}
            selected={"/gen-openapi" === location.pathname}
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
          >
            <ApiIcon />
            {!minimized && <>OpenAPI</>}
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate(routes.COLLECTION);
            }}
            selected={routes.COLLECTION === location.pathname}
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
          >
            <FolderCopyOutlined />
            {!minimized && <>Collections</>}
          </ListItemButton>
        </List>
      </Paper>
    </div>
  );
};
