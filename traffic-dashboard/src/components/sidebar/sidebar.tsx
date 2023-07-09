import {
  ChevronLeft,
  ChevronRight,
  Home,
  SwapHoriz,
} from "@mui/icons-material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import ApiIcon from '@mui/icons-material/Api';
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./sidebar.module.scss";

export const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);

  const handleMenuIconClicked = () => {
    setMinimized((prev) => !prev);
  };

  return (
    <div className={styles.sidebarContainer} data-is-minimized={minimized}>
      <Paper className={styles.paper} elevation={8}>
        <div className={styles.toggleMenu} onClick={handleMenuIconClicked}>
          <IconButton>
            {minimized ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <List>
          <ListItem>
            <Typography>Menu</Typography>
          </ListItem>
          <ListItemButton
            alignItems="center"
            onClick={() => {
              navigate("/home");
            }}
            className={styles.listItem}
          >
            <Home />
            {!minimized && <>Home</>}
          </ListItemButton>
          <ListItemButton
            alignItems="center"
            className={styles.listItem}
            onClick={() => {
              navigate("/config");
            }}
          >
            <SettingsInputComponentIcon />
            {!minimized && <>Config</>}
          </ListItemButton>
          <ListItemButton
            alignItems="center"
            className={styles.listItem}
            onClick={() => {
              navigate("/requests");
            }}
          >
            <SwapHoriz />
            {!minimized && <>Requests</>}
          </ListItemButton>
          <ListItemButton
            alignItems="center"
            className={styles.listItem}
            onClick={() => {
              navigate("/mocks");
            }}
          >
            <DataObjectIcon />
            {!minimized && <>Mocks</>}
          </ListItemButton>
          <ListItemButton
            alignItems="center"
            className={styles.listItem}
            onClick={() => {
              navigate("/gen-openapi");
            }}
          >
            <ApiIcon />
            {!minimized && <>OpenAPI</>}
          </ListItemButton>
        </List>
      </Paper>
    </div>
  );
};
