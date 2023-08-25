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
        <div className={styles.toggleMenu} onClick={handleMenuIconClicked}>
          <IconButton>
            {minimized ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <List>
          <ListItem
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
          >
            <Typography>Menu</Typography>
          </ListItem>
          <ListItemButton
            onClick={() => {
              navigate("/home");
            }}
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
            onClick={() => {
              navigate("/config");
            }}
          >
            <SettingsInputComponentIcon />
            {!minimized && <>Services</>}
          </ListItemButton>
          <ListItemButton
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
            onClick={() => {
              navigate("/requests");
            }}
          >
            <SwapHoriz />
            {!minimized && <>Requests</>}
          </ListItemButton>
          <ListItemButton
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
            onClick={() => {
              navigate("/mocks");
            }}
          >
            <DataObjectIcon />
            {!minimized && <>Mocks</>}
          </ListItemButton>
          <ListItemButton
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
            onClick={() => {
              navigate("/gen-openapi");
            }}
          >
            <ApiIcon />
            {!minimized && <>OpenAPI</>}
          </ListItemButton>
          <ListItemButton
            className={c({
              [styles.listItem]: true,
              [styles.listItemMinimized]: minimized,
            })}
            onClick={() => {
              navigate(routes.COLLECTION);
            }}
          >
            <FolderCopyOutlined />
            {!minimized && <>Collections</>}
          </ListItemButton>
        </List>
      </Paper>
    </div>
  );
};
